import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from '../../app/Models/Role'

export default class extends BaseSeeder {
  public async run () {
    await Role.createMany([
      {"name":"admin"},
      {"name":"user"},
      {"name":"guest"}
    ]);
    

  }
}
