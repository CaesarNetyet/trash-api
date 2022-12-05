import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User';
import { addCarRequest } from 'App/Requests/Adafruit';

export default class AdafruitsController {
    public async addCar({request, auth, response}: HttpContextContract){
        const user = await User.findOrFail(auth.user?.id);

        const payload = await request.validate({
            schema: schema.create({
                car_name: schema.string([
                    rules.unique({ table: 'cars', column: 'car_name' })
                ]),
                sensors: schema.array().members(
                    schema.number()
                )
            })
        })
        const [data, error] = await addCarRequest(payload.car_name);

        return response.json({status: 201, message: "Cart added"});
       
    }


}
