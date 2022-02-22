// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpException } from '@adonisjs/generic-exceptions'
import User from 'App/Models/User'
import SignUpValidator from 'App/Validators/SignUpValidator'

export default class RegistrationsController {
  /**
   * Sign Up
   */
  public async handle({ auth, request }) {
    const payload = await request.validate(SignUpValidator)

    const user = await User.findBy('phone', payload.phone)

    if (user) {
      throw new HttpException('An account is already associated with this phone number', 409)
    }

    try {
      const newUser = await User.create(payload)
      const tokens = await auth.login(newUser)

      return {
        data: {
          ...newUser.toJSON(),
          authentication: tokens,
        },
      }
    } catch (error) {
      throw error
    }
  }
}
