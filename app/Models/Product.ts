import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Sensor from './Sensor'

export default class Product extends BaseModel {

  @manyToMany(()=> Sensor)
  public sensors: ManyToMany<typeof Sensor>

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public adafruit_key: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
