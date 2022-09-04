import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import Message from 'App/Models/Message';
import { rules, schema, validator } from '@ioc:Adonis/Core/Validator';
import jwt from 'jsonwebtoken';
import Database from '@ioc:Adonis/Lucid/Database';
import { hashPassword, verifyPassword } from 'App/Utils/helper';
import {
	BAD_REQUEST_STATUS_CODE,
	INTERNAL_SERVER_ERROR_STATUS_CODE,
	SUCCESS_STATUS_CODE,
} from 'App/Utils/responseCodes';
import { DateTime } from 'luxon';

export default class UsersController {
	async login({ request, response }: HttpContextContract) {
		try {
			const validator = schema.create({
				email: schema.string({ trim: true }),
				password: schema.string(),
			});

			/**
			 * Validate the request
			 */
			const { email, password } = await request.validate({
				schema: validator,
			});

			const user = await User.query().where('email', email).first();

			if (!user) {
				return response.sendResponse({
					statusCode: 400,
					success: false,
					message: 'The email you entered is incorrect. Please try again',
				});
			}

			const verified = await verifyPassword(password, user.password);
			console.log(verified);
			if (!(await verifyPassword(password, user.password))) {
				return response.sendResponse({
					statusCode: 400,
					success: false,
					message: 'The password you entered is incorrect. Please try again',
				});
			}

			const token = jwt.sign(
				{
					sub: {
						email: user.email,
						first_name: user.first_name,
						last_name: user.last_name,
						id: user.id,
					},
				},
				'firstblocsampleappsecret',
				{ expiresIn: '1d' }
			);

			return response.sendResponse({
				statusCode: SUCCESS_STATUS_CODE,
				success: true,
				message: 'Login successful',
				data: {
					user,
					token,
				},
			});
		} catch (error) {
			return response.sendResponse({
				statusCode: INTERNAL_SERVER_ERROR_STATUS_CODE,
				success: false,
				message: error.message || 'There was an error in generating auth token',
			});
		}
	}

	async createUser({ request, response }: HttpContextContract) {
		const trx = await Database.transaction();

		try {
			const validated = schema.create({
				first_name: schema.string({ trim: true }),
				last_name: schema.string({ trim: true }),
				password: schema.string({ trim: true }),
				email: schema.string({ trim: true }, [
					rules.unique({ table: 'users', column: 'email' }),
					rules.email(),
				]),
			});

			let { ...userData } = await request.validate({
				schema: validated,
				messages: {
					'email.unique': 'Email already exists',
				},
				reporter: validator.reporters.api,
			});

			const newUser = new User();
			const hashedPass = await hashPassword(userData.password);
			console.log('hashedPass: ***', hashedPass);
			if (hashedPass) {
				userData.password = hashedPass;
			}

			newUser.fill(userData);
			newUser.useTransaction(trx);
			await newUser.save();

			await trx.commit();

			return response.sendResponse({
				statusCode: SUCCESS_STATUS_CODE,
				success: true,
				message: 'User Successfully Created',
				data: newUser,
			});
		} catch (error) {
			await trx.rollback();
			return response.sendResponse({
				statusCode: INTERNAL_SERVER_ERROR_STATUS_CODE,
				success: false,
				message: error.message || 'Mobile 2FA not sent',
			});
		}
	}

	async sendMessage({ request, response }: HttpContextContract) {
		const sender_id = request.input('sender_id');
		const content = request.input('content');
		const conversation_id = request.input('conversation_id');

		if (!sender_id || !content || !conversation_id) {
			return response.sendResponse({
				statusCode: INTERNAL_SERVER_ERROR_STATUS_CODE,
				success: false,
				message: 'Something went wrong. Please try again later.',
			});
		}

		const trx = await Database.transaction();
		try {
			const newMessage = new Message();
			newMessage.fill({
				sender_id,
				content,
				conversation_id,
			});
			await newMessage.save();

			await trx.commit();
		} catch (error) {
			await trx.rollback();
			return response.sendResponse({
				statusCode: INTERNAL_SERVER_ERROR_STATUS_CODE,
				success: false,
				message: error.message || 'Mobile 2FA not sent',
			});
		}
	}

	async getUsersPaginated({ params, response }: HttpContextContract) {
		const page = params.page || 1;
		const limit = params.limit || 10;
		const field = params.field;
		const order = params.order;

		let sortOrder: 'desc' | 'asc' | undefined =
			order === 'descend' ? 'desc' : 'asc';
		let sorter: any = [{ column: 'created_at', order: sortOrder }];

		if (field === 'fullname') {
			sorter = [
				{ column: 'last_name', order: sortOrder },
				{ column: 'first_name', order: sortOrder },
			];
		}

		const users = await User.query().orderBy(sorter).paginate(page, limit);

		return response.sendResponse({
			statusCode: SUCCESS_STATUS_CODE,
			success: true,
			message: `Users for page: ${page}`,
			data: users,
		});
	}

	async updateUser({ request, response }: HttpContextContract) {
		const userData = request.body();

		if (!userData.id) {
			return response.sendResponse({
				statusCode: BAD_REQUEST_STATUS_CODE,
				success: false,
				message: `Missing user id`,
			});
		}

		const trx = await Database.transaction();
		try {
			const user = await User.find(userData.id);

			if (!user) {
				return response.sendResponse({
					statusCode: BAD_REQUEST_STATUS_CODE,
					success: false,
					message: `User not found`,
				});
			}

			user.merge(userData);
			await user.save();

			await trx.commit();

			return response.sendResponse({
				statusCode: SUCCESS_STATUS_CODE,
				success: true,
				message: `User updated`,
				data: user,
			});
		} catch (error) {
			await trx.rollback();
			return response.sendResponse({
				statusCode: INTERNAL_SERVER_ERROR_STATUS_CODE,
				success: false,
				message: error.message || `Server Error.`,
			});
		}
	}

	/**
	 * soft delete
	 */
	async deleteUser({ request, response }: HttpContextContract) {
		const id = request.id;

		if (!id) {
			return response.sendResponse({
				statusCode: BAD_REQUEST_STATUS_CODE,
				success: false,
				message: `Missing user id`,
			});
		}

		const trx = await Database.transaction();
		try {
			const user = await User.find(id);

			if (!user) {
				return response.sendResponse({
					statusCode: BAD_REQUEST_STATUS_CODE,
					success: false,
					message: `User not found`,
				});
			}

			user.deleted_at = DateTime.now();
			await user.save();

			await trx.commit();

			return response.sendResponse({
				statusCode: SUCCESS_STATUS_CODE,
				success: true,
				message: `User deleted`,
			});
		} catch (error) {
			await trx.rollback();
			return response.sendResponse({
				statusCode: INTERNAL_SERVER_ERROR_STATUS_CODE,
				success: false,
				message: error.message || `Server Error.`,
			});
		}
	}
}
