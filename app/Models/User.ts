import { DateTime } from 'luxon';
import {
	BaseModel,
	column,
	computed,
	hasOne,
	HasOne,
} from '@ioc:Adonis/Lucid/Orm';
import ConversationList from './ConversationList';

export default class User extends BaseModel {
	public static table = 'users';

	@column({ isPrimary: true })
	public id: number;

	@column.dateTime({ autoCreate: true })
	public created_at: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updated_at: DateTime;

	@column.dateTime({ autoCreate: false, autoUpdate: false })
	public deleted_at: DateTime;

	@column()
	public first_name: string;

	@column()
	public last_name: string;

	@computed()
	public get fullName() {
		return `${this.first_name} ${this.last_name}`;
	}

	@column()
	public email: string;

	@column({ serializeAs: null })
	public password: string;

	@hasOne(() => ConversationList, {
		foreignKey: 'user_id',
	})
	conversations_list: HasOne<typeof ConversationList>;
}
