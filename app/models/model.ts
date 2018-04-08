import { storage, entity } from '../modules/storage';

export default class Model {
    //Table name in DB to use
    protected static table: string;

    public static find(id: number): Promise<entity> {
        return new Promise((resolve, reject) => {
            storage.getFromId({ table: this.table, id }).then((row: entity) => {
                resolve(row);
            }).catch((error: Error) => reject(error));
        });
    }

    /*public static all(): Promise<entity[]> {
        return new Promise((resolve, reject) => {
            storage.getTable({ table: this.table }).then((rows: entity[]) => {
                resolve(rows);
            }).catch((error: Error) => reject(error));
        });
    }*/

    /*public static create(data: entity): Promise<any> {

    }*/
}