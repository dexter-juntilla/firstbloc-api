import { test } from '@japa/runner';
import { hashPassword, verifyPassword } from 'App/Utils/helper';

const sample_password = 'Passw0rd3';

test.group('Helpers', () => {
	// Write your test here
	test('bcrypt has a given password', async ({ assert }) => {
		const hashedPass = await hashPassword(sample_password);

		assert.exists(hashedPass);
		assert.isNotEmpty(hashedPass);
	});

	test('password hash verified true with given password', async ({
		assert,
	}) => {
		const verified = await verifyPassword(
			sample_password,
			'$2a$10$a50pIfH2YXzz69MPuIgK6uKED4fTYgGVdEMX1hOM8o4pS7YhrjjZO'
		);

		assert.exists(verified);
		assert.isNotFalse(verified);
	});

	test('password hash verifies false with wrong password', async ({
		assert,
	}) => {
		const verified = await verifyPassword(
			'sample_password',
			'$2a$10$a50pIfH2YXzz69MPuIgK6uKED4fTYgGVdEMX1hOM8o4pS7YhrjjZO'
		);

		assert.exists(verified);
		assert.isFalse(verified);
	});
});
