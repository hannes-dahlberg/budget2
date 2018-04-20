import Model from './model';
import { storage, entity } from '../modules/storage';
import * as helpers from '../modules/helpers';

export default class User extends Model {
    protected static table = 'users';

    public static getByEmail(email: string): Promise<entity> {
        return new Promise((resolve, reject) => {
            storage.db.get(`SELECT * FROM [${this.table}] WHERE [email] = '${email}'`, (error: Error, row: any) => {
                if(error) { reject(error); return; }
                resolve(row);
            });
        });
    }

    public static create(data?: entity): Promise<User> {
        if(!data.email || !data.password) {
            return new Promise((resolve, reject) => {
                reject(new Error('Email and or password is missing'));
            });
        }

        return super.create(data);
    }
}