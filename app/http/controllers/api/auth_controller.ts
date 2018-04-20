import { Request, Response } from 'express';

import Controller from '../controller';
import * as helpers from '../../../modules/helpers';

import User from '../../../models/user';
import { entity } from '../../../modules/storage';

/*Authentication controller. Takes care of authentication, registration
activation and password resets*/
export default class AuthController extends Controller {
    //Authentication controller
    public static auth(request: Request, response: Response): void {
        /*Check request body for email and password. Sends 500 error with
        message if any is missing*/
        if(!request.body.email || request.body.pasword) {
            response.status(500).send('email and/or password was missing from request data');
            return;
        }

        //Get user by email from user model
        User.getByEmail(request.body.email).then((user: entity) => {
            //If user was not found, send 401
            if(!user) { response.sendStatus(401); return; }
            //Check posted password with stored password has for user
            if(helpers.hashCheck(request.body.password, user.password)) {
                //Send respons with a new JWT token and the user data
                response.json(helpers.toJson({
                    token: helpers.signJwt({ userId: user.id }),
                    user
                }))
            } else { response.sendStatus(401); }
        });
    }
}