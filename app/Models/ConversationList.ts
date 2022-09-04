import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Conversation from './Conversation';

export default class ConversationList extends BaseModel {
  public static table = 'conversation_list';

  @column({ isPrimary: true })
  public id: number;

  @column()
  public user_id: number;

  @hasMany(() => Conversation, {
    foreignKey: 'conversation_list_id',
  })
  patientInsulinDetails: HasMany<typeof Conversation>;
}
