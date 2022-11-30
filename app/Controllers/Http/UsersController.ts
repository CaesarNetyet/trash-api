import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User';
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'
import Mail from '@ioc:Adonis/Addons/Mail';
import Route from '@ioc:Adonis/Core/Route'
export default class UsersController {
    
    public async register ({ request }: HttpContextContract) {
        const payload = await request.validate({
            schema: schema.create({
                name: schema.string(),
                email: schema.string([
                    rules.email(),
                    rules.unique({ table: 'users', column: 'email' }),
                ]),
                password: schema.string(),
                phone_number: schema.string([
                    rules.maxLength(10),
                    rules.minLength(9),
                ]),
              
            })
        })
        payload.password = await Hash.make(payload.password);
        

        const user = await User.create(payload);

        const url = Route.makeSignedUrl('verifyEmail', 
          {
            user: user.id,
          },
          {
            prefixUrl: 'http://localhost:3333'
          
          });
        


        await Mail.use('smtp').sendLater( message => {
            
            message
                .from("caesarnetyet@gmail.com")
                .to(user.email)
                .subject("Welcome my good friend")
                .htmlView('emails/welcome', {name: user.name, url: url})
        });
        return {message: "Email sent", user};
    }

    public async login ({ request, response, auth }: HttpContextContract) {

        const email = request.input('email');

        const password = request.input('password');

        const token = await auth.use('api').attempt(email, password);

        return {status:201,
            token: token.token,
            user: token.user
            };
    }
    
    
    public async show ({auth}) {

        const { user } =  auth;

        return {message: "Email sent", user};
    }


    public async verifyEmail({request, params, response }: HttpContextContract) {
        if (!request.hasValidSignature()) {
            return "Invalid or expired URL";
          }
        const user = await User.findOrFail(params.user);
        user.is_active = true;
        await user.save();
        return response.json({message: "Email verified"});
    }

    
    public async update ({ params, request, response }: HttpContextContract) {
        const user = await User.findOrFail(params.id);
        const data = request.only(['name', 'email', 'password', 'phoneNumber', 'role_id', 'is_active']);
        user.merge(data);
        await user.save();
        return response.json(user);
    }
    
   
}
