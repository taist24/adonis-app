import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Profile from 'App/Models/Profile'

export default class Profiles extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('email', 255).notNullable()
      table.string('first_name', 255).notNullable()
      table.string('last_name', 255).notNullable()
      table.date('birthdate').notNullable()
      table.string('avatar').notNullable()
      table.enum('gender', Object.values(Profile.GenderEnum)).notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
