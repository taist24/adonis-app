// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpException } from '@adonisjs/generic-exceptions'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  /**
   * Get user
   */
  public async show({ request }) {
    const userId = request.param('user')

    try {
      const user = await User.findOrFail(userId)
      return { data: user }
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new HttpException('User not found!', 404)
      }

      throw error
    }
  }

  /**
   * Update user
   */
  public async update({ auth, request }) {
    const userId = request.param('user')
    const payload = await request.validate(UpdateUserValidator)

    try {
      let user = await User.findOrFail(userId)

      if (user.id !== auth.user.id) {
        throw new HttpException('This action is unauthorized', 403)
      }

      user = await user.merge({ ...payload, birthdate: payload.birthdate.toISODate() }).save()

      return { data: user }
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new HttpException('User not found!', 404)
      }

      throw error
    }
  }

  /**
   * Store user
   */
  public async store({ request }) {
    const payload = await request.validate(CreateUserValidator)

    if (await User.findBy('email', payload.email)) {
      throw new HttpException('A user already exist with this email', 409)
    }

    const user = await User.create(payload)

    return { data: { ...user.toJSON() } }
  }
}
