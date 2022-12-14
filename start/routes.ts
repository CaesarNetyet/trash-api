/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Sensor from 'App/Models/Sensor';

Route.get('/', async () => {
  return { '/user': {
    '/register': {
      "name": "string",
      "email": "string",
      "password": "string",
      "phone_number": "string (10 digits)"
    },
    '/login': {
      "email": "string",
      "password": "string"
    },
    '/update': {
      "id": "number"
    }

  }}
})


Route.group(()=> {
  Route.post('/addcar', 'AdafruitsController.addCar');
  Route.post('/addsensor', 'AdafruitsController.addSensor');
  Route.delete('/deletecar/:id', 'AdafruitsController.deleteCar');
  Route.get('/getcars', 'AdafruitsController.getCars');
  Route.get('/getcar/:id', 'AdafruitsController.getCar');
  Route.get('getcar/:id/sensors', 'AdafruitsController.getCarSensors');
}).middleware(['auth:api', 'active']).prefix('adafruit');

Route.group(() => {
  Route.post('verify/:user', 'UsersController.verify').as('verify');
  Route.post('/register', 'UsersController.register')
  Route.post('/login', 'UsersController.login')
  Route.group(()=> {
    Route.get('/', 'UsersController.show');
    Route.put('/update', 'UsersController.update');
    Route.delete('/delete', 'UsersController.destroy');
  }).middleware('auth:api')
   
}).prefix('user');


Route.post('test', async ({request}) => {
  return request
})

Route.get('sensors', async()=> {
  return await Sensor.all()
})