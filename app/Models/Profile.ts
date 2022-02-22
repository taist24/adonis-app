import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export default class Profile extends BaseModel {
  public static readonly GenderEnum = GenderEnum

  @column({ isPrimary: true, serializeAs: 'profileId' })
  public id: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column.date()
  public birthdate: DateTime

  @column()
  public gender: GenderEnum

  @column()
  public avatar: string

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
