import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Active {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if (!auth.user?.active) return response.status(403).json({message: "User is not active"});

    await next()
  }
}
