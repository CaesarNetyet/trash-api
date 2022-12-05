import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Sensor from 'App/Models/Sensor';

export default class extends BaseSeeder {
  public async run () {
    await Sensor.createMany([
      {"name":"Geolocalizador"},
      {"name":"Temperatura"},
      {"name":"Peso"},
      {"name":"distancia"},
      {"name":"Sensor para control"},
      {"name":"Sensor bluetooth"},
    ]);
    
    // Write your database queries inside the run method
  }
}
