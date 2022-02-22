import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpException } from '@adonisjs/generic-exceptions'
import Profile from 'App/Models/Profile'
import DeleteProfileValidator from 'App/Validators/DeleteProfileValidator'
import User from 'App/Models/User'
import CreateProfileValidator from 'App/Validators/CreateProfileValidator'
import Application from '@ioc:Adonis/Core/Application'
import UpdateProfileValidator from 'App/Validators/UpdateProfileValidator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ProfilesController {
  /**
   * Store user profile
   */
  public async store({ auth, request }: HttpContextContract) {
    const { avatar, ...payload } = await request.validate(CreateProfileValidator)

    const profile = await Profile.findBy('user_id', auth.user?.id)

    if (profile) {
      throw new HttpException('Profile already exist', 422)
    }

    await avatar.move(Application.publicPath('storage/profiles'))

    const user = await User.findOrFail(auth.user?.id)

    const newProfile = await user.related('profile').create({
      ...payload,
      avatar: `storage/profiles/${avatar.fileName}`,
    })

    return { data: newProfile }
  }

  /**
   * Get user profile
   */
  public async index({ auth }: HttpContextContract) {
    const profile = await Profile.findBy('user_id', auth.user?.id)
    return { data: profile ?? {} }
  }

  public async update({ auth, request }: HttpContextContract) {
    const { avatar, ...payload } = await request.validate(UpdateProfileValidator)

    try {
      let oldAvatar: string | null = null
      let profile = await Profile.findByOrFail('user_id', auth.user?.id)

      // new image
      if (avatar) {
        oldAvatar = profile.avatar
        await avatar.move(Application.publicPath('storage/profiles'))
      }

      profile = await profile
        .merge({
          ...payload,
          ...(avatar && { avatar: `storage/profiles/${avatar.fileName}` }),
        })
        .save()

      // delete old image
      if (oldAvatar) {
        // await delete
      }

      return { data: profile }
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new HttpException('Profile not found', 422)
      }
      throw error
    }
  }

  public async destroy({ auth, request }: HttpContextContract) {
    const { phone } = await request.validate(DeleteProfileValidator)

    if (phone !== auth.user?.phone) {
      throw new HttpException('This action is unauthorized', 403)
    }

    await Database.query().from('profiles').where('user_id', auth.user.id).delete()

    return { message: 'Profile deleted successfully!' }
  }
}
