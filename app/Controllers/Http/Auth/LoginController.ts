// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpException } from '@adonisjs/generic-exceptions'
import User from 'App/Models/User'

import LoginValidator from 'App/Validators/LoginValidator'

export default class LoginController {
  /**
   * Login user
   */
  private async handle({ auth, request }) {
    const payload = await request.validate(LoginValidator)

    try {
      const authentication = await auth.attempt(payload.email, payload.password)
      const user = await User.findByOrFail('email', payload.email)
      return { data: { ...user.toJSON(), authentication } }
    } catch (error) {
      if (error.name === 'InvalidCredentialsException') {
        throw new HttpException('The email or password is invalid', 422)
      }
      throw error
    }
  }
}
