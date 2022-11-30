import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User';
import { schema } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'
export default class UsersController {

    public async index ({ request, response }: HttpContextContract) {
        const users = await User.all();
        return response.json(users);
    }
    
    public async register ({ request, response }: HttpContextContract) {
        const payload = await request.validate({
            schema: schema.create({
                name: schema.string(),
                email: schema.string(),
                password: schema.string(),
                phone_number: schema.string(),
              
            })
        })
        payload.password = await Hash.make(payload.password);
       



        const user = await User.create(payload);
        return response.json(user);
    }

    public async login ({ request, response, auth }: HttpContextContract) {
        const email = request.input('email');
        const password = request.input('password');
        const token = await auth.use('api').attempt(email, password);
        return response.json(token);
    }
    
    
    public async show ({ params, request, response }: HttpContextContract) {
        const user = await User.findOrFail(params.id);
        return response.json(user);
    }
    
    public async update ({ params, request, response }: HttpContextContract) {
        const user = await User.findOrFail(params.id);
        const data = request.only(['name', 'email', 'password', 'phoneNumber', 'role_id', 'is_active']);
        user.merge(data);
        await user.save();
        return response.json(user);
    }
    
    public async destroy ({ params, request, response }: HttpContextContract) {
        const user = await User.findOrFail(params.id);
        await user.delete();
        return response.json(user);
    }
}
