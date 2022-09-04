import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import User from './User';

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public user_id: number;

  @column({})
  public type: string;

  @column({})
  public token: string;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @hasOne(() => User, {
    foreignKey: 'id',
  })
  userByUserId: HasOne<typeof User>;
}
