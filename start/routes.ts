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

Route.get('/', async () => {
  return { hello: 'world' }
})

// v1
Route.group(() => {
  // guest
  Route.post('/login', 'Auth/LoginController')
  Route.post('/sign-up', 'Auth/RegistrationsController')

  // auth
  Route.group(() => {
    Route.get('/users/:user', 'UsersController.show')
    Route.post('/users/store', 'UsersController.store')
    Route.patch('/users/:user', 'UsersController.update')

    Route.resource('/user/profile', 'ProfilesController').only(['store', 'index'])
    Route.patch('/user/profile', 'ProfilesController.update')
    Route.delete('/user/profile', 'ProfilesController.destroy')
  }).middleware(['auth'])
}).prefix('api/v1')
