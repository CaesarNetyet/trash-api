

import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'

export default class User extends BaseModel {

  @manyToMany(()=> Product)
  public products: ManyToMany<typeof Product>

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public phone_number: string

  @column()
  public role_id : number
  
  @column()
  public code : number
  

  @column()
  public is_active: boolean


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
