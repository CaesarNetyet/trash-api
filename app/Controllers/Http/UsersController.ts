import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User';
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'
import Route from '@ioc:Adonis/Core/Route'
import sendTwilioMessage from '../../../config/messages';
export default class UsersController {

    
    
    public async register ({auth, request, response }: HttpContextContract) {

        const randomCode: number = Math.floor(1000 + Math.random() * 9000);

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
        
        const [messageRequest, error] = await sendTwilioMessage(`Your verification code is ${randomCode}`, payload.phone_number);

        if (error) {
            return response.status(403).json({message: "Error sending message", error});
        }
        const user = await User.create(payload);
        
        const url = Route.makeSignedUrl('verify', 
          {
            user: user.id,
          },
          {
            prefixUrl: 'http://trash-api.me:3333'
          
          });

          

            user.code = randomCode;
            await user.save();
            const token = await auth.use('api').generate(user)
            return {status:201, token: token.token, url: url, messageRequest}     

    }

    public async login ({ request, response, auth }: HttpContextContract) {

        const email = request.input('email');

        const password = request.input('password');

        const token = await auth.use('api').attempt(email, password);

        return response.status(201).json({status:201,
            token: token.token,
            role: token.user.role_id,
            user: token.user
            });
    }
    
    
    public async show ({auth}) {

        const { user } =  auth;

        return { user};
    }


    public async verify({request, params, response }: HttpContextContract) {
        if (!request.hasValidSignature()) {
            return "Invalid or expired URL";
          }
        const user = await User.findOrFail(params.user);
     
        if(request.input('code') != user.code) return response.status(403).json({message: "Invalid code"});
        user.is_active = true;
        await user.save();
        return response.status(201).json({status:201,message: "Phone number verified"});
    }

    public async testVerification({response}){
        const [messageRequest, error] = await sendTwilioMessage("Wenas", "8139895086");

        if (error) {
            return response.status(403).json({message: "Error sending message", error});
        }

     return response.json({messageRequest});

    }
    public async update ({ params, request, response }: HttpContextContract) {
        const user = await User.findOrFail(params.id);
        const data = request.only(['name', 'email', 'password', 'phoneNumber', 'role_id', 'is_active']);
        user.merge(data);
        await user.save();
        return response.json(user);
    }
    
   
}
