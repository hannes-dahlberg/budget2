import Model from './model';
import { storage, entity } from '../modules/storage';
import * as helpers from '../modules/helpers';

export default class User extends Model {
    protected static table = 'users';

    public static getByEmail(email: string): Promise<entity> {
        return new Promise((resolve, reject) => {
            storage.db.get(`SELECT * FROM [` + this.table + `] WHERE [email] = '` + email + `'`, (error: Error, row: any) => {
                if(error) { reject(error); return; }
                resolve(row);
            });
        });
    }

    public static create(email: string, password: string): Promise<void> {
        return new Promise((resolve, reject) => {
            storage.db.run(`INSERT INTO [${this.table}] ([email], [password]) VALUES('${email}', '${helpers.hash(password)}')`, (error: Error) => {
                if(error) { reject(error); return; }
                resolve();
            });
        });
    }
}