import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Sensor from "App/Models/Sensor";
import User from "App/Models/User";
import { addCarRequest, addSensorRequest } from "App/Requests/Adafruit";

export default class AdafruitsController {




  public async addCar({ request, auth, response }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id);

    const payload = await request.validate({
      schema: schema.create({
        car_name: schema.string([
            rules.unique({ table: "products", column: "name" })
        ]),
        sensors: schema.array().members(schema.number()),
      }),
    });

    const [carData, error] = await addCarRequest(payload.car_name);


    if (error) {
      return response.json({
        status: 400,
        message: "Error adding car",
        details: error,
      });
    }


    const car = await user.related("products").create({
        name: payload.car_name,
        adafruit_key: carData.key,
    });

    payload.sensors.map(async sensor_id => {
        const sensor = await Sensor.findOrFail(sensor_id);
        const [sensorData, error] = await addSensorRequest(sensor.name, car.adafruit_key);
        if (error) {
            return response.json({
            status: 400,
            message: "Error adding sensor",
            details: error,
            });
        }
        car.related('sensors').attach([sensor.id])
        console.log(sensorData)
    })
    return response.json({ status: 201, message: "Cart added" });
  }


  
}
