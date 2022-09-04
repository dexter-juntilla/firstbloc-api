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

import Route from '@ioc:Adonis/Core/Route';

Route.get('/', async () => {
	return { hello: 'world' };
});

/**
 * USER ROUTES
 */
Route.group(() => {
	Route.delete(':id', 'UsersController.deleteUser');

	Route.put('', 'UsersController.updateUser');

	Route.get('paginated', 'UsersController.getUsersPaginated');

	Route.post('', 'UsersController.createUser');
	Route.post('login', 'UsersController.login');

	Route.post('message', 'UsersController.sendMessage')
		.as('users.message')
		.middleware('auth');
}).prefix('api/users');
