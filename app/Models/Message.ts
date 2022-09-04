import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Conversation from './Conversation';
import User from './User';

export default class Message extends BaseModel {
	public static table = 'user';

	@column({ isPrimary: true })
	public id: number;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@column()
	public sender_id: number;

	@column()
	public conversation_id: number;

	@column()
	public content: string;

	@belongsTo(() => Conversation, {
		foreignKey: 'conversation_id',
	})
	public conversation: BelongsTo<typeof Conversation>;

	@belongsTo(() => User, {
		foreignKey: 'sender_id',
	})
	public user: BelongsTo<typeof User>;
}
