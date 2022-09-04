import { DateTime } from 'luxon';
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Message from './Message';

export default class Conversation extends BaseModel {
	public static table = 'conversations';

	@column({ isPrimary: true })
	public id: number;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@column()
	public title: string;

	@column()
	public conversation_list_id: string;

	@hasMany(() => Message, {
		foreignKey: 'conversation_id',
	})
	patientInsulinDetails: HasMany<typeof Message>;
}
