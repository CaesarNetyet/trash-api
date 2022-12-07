import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Sensor from "App/Models/Sensor";
import User from "App/Models/User";
import { addCarRequest, addSensorRequest, deleteCarRequest } from "App/Requests/Adafruit";

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
            message: "Error añadiendo sensor",
            details: error,
            });
        }
        car.related('sensors').attach([sensor.id])
        console.log(sensorData)
    })
    return response.json({ status: 201, message: "Carro agregado" });
  }

    public async getCars({ auth, response }: HttpContextContract) {
      const user = await User.findOrFail(auth.user?.id);
      const cars = await user.related("products").query();
      return response.json({ status: 200, cars });
    }

    public async getCar({ auth, response, params }: HttpContextContract) {
      const user = await User.findOrFail(auth.user?.id);
      const car = await user.related("products").query().where("id", params.id);
      return response.json({ status: 200, car });
    }

    public async getCarSensors({ auth, response, params }: HttpContextContract) {
      const user = await User.findOrFail(auth.user?.id);
      const car = await user.related("products").query().where("id", params.id).firstOrFail();
      if (!car) return response.json({
          status: 400,
          message: "Carro no encontrado",
        });

      const sensors = await car.related("sensors").query();
      return response.json({ status: 200, sensors });
    }

    public async deleteCar({ auth, response, params }: HttpContextContract) {
      const user = await User.findOrFail(auth.user?.id);
      const car = await user.related("products").query().where("id", params.id).firstOrFail();
      if (!car) return response.json({
          status: 400,
          message: "Carro no encontrado",
        });

      await car.delete();

      const [carData, error] = await deleteCarRequest(car.adafruit_key);
      if (error) return response.json({
          status: 400,
          message: "Error deleting car",
          details: error,
        });
      
      console.log(carData);
      return response.json({ status: 200, message: "Carro Eliminado" });
    }
}
