import { Request, Response } from 'express';

import Controller from '../controller';
import Account from '../../../models/account';

import * as helpers from '../../../modules/helpers';

export default class AccountController extends Controller {
    public static index(request: Request, response: Response): void {
        Account.all().then((accounts: Account[]) => {
            response.json(helpers.toJson(accounts));
        }).catch((error: Error) => { console.log(error); response.sendStatus(500); });
    }
    public static create(request: Request, response: Response): void {

    }
    public static store(request: Request, response: Response): void {

    }
    public static show(request: Request, response: Response): void {

    }
    public static update(request: Request, response: Response): void {

    }
    public static destroy(request: Request, response: Response): void {

    }
}