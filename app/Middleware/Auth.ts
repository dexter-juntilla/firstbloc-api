import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import jwt from 'jsonwebtoken';

export default class Auth {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    if (request.matchesRoute(['users.message'])) {
      console.log(request.headers());
      const { authorization } = request.headers();
      const splitted = authorization?.split('Bearer ');

      if (!splitted || (!splitted.length && !splitted[1])) {
        response.sendResponse({
          statusCode: 404,
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const jwtToken = splitted[1];
      console.log(jwtToken);
      let jData: any = {};
      try {
        const jwtData = jwt.verify(jwtToken, 'firstblocsampleappsecret');

        jData = jwtData?.sub || {};
        console.log('JDATA: ', jData);
        const user = await User.findBy('email', jData.email);

        if (!user) {
          return response.sendResponse({
            statusCode: 400,
            success: false,
            message: 'Invalid authentication token',
          });
        }
      } catch (error) {
        return response.sendResponse({
          statusCode: 400,
          success: false,
          message: 'Invalid authentication token',
        });
      }
    }

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next();
  }
}
