// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpException } from '@adonisjs/generic-exceptions'
import User from 'App/Models/User'

import LoginValidator from 'App/Validators/LoginValidator'

export default class LoginController {
  /**
   * Login user
   */
  public async handle({ auth, request }) {
    const payload = await request.validate(LoginValidator)

    try {
      const user = await User.findByOrFail('phone', payload.phone)
      const authentication = await auth.login(user)
      return { data: { ...user.toJSON(), authentication } }
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new HttpException('The email or password is invalid', 422)
      }
      throw error
    }
  }
}
