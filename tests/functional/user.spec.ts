import { test } from '@japa/runner';

test.group('Users', () => {
	test('get a paginated list of users', async ({ client, assert }) => {
		const response = await client.get('/api/users/paginated');

		console.log(response.body());

		assert.exists(response);
		response.assertStatus(200);
		response.assertBodyContains({
			data: {
				meta: {},
				data: [],
			},
		});
	});
});
