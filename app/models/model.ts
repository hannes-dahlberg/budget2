import { storage, entity } from '../modules/storage';

export default class Model {
    //Table name in DB to use
    protected static table: string;

    public data: entity;

    constructor(data?: entity) {
        this.data = data;
    }

    public static find(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            storage.getFromId({ table: this.table, id }).then((row: entity) => {
                resolve(new this(row));
            }).catch((error: Error) => reject(error));
        });
    }

    public static all(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            storage.getTable({ table: this.table }).then((rows: entity[]) => {
                resolve(rows.map(row => new this(row)));
            }).catch((error: Error) => reject(error));
        });
    }

    public static create(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            storage.insert({ data, table: this.table }).then((row: entity) => {
                resolve(new this(row));
            }).catch((error: Error) => reject(error));
        });
    }
    public update(): Promise<void> {
        return new Promise((resolve, reject) => {
            storage.update({ data: this.data, table: (this.constructor as typeof Model)['table'] }).then((row: entity) => {
                resolve();
            }).catch((error: Error) => reject(error));
        });
    }
    public delete(): Promise<void> {
        return new Promise((resolve, reject) => {
            storage.delete({ table: (this.constructor as typeof Model)['table'], id: this.data.id }).then(() => resolve()).catch((error: Error) => reject(error));
        })
    }

    protected hasMany(model: any, columnKey: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            storage.db.all(`SELECT * FROM [${model.table}] WHERE [${columnKey}] = ${this.data.id}`, (error: Error, rows: any[]) => {
                if(error) { reject(error); return; }
                resolve(rows.map((row: any) => (new model(row))));
            });
        });
    }

    protected belongTo(model: any, columnKey: string): Promise<any> {
        return new Promise((resolve, reject) => {
            storage.db.get(`SELECT * FROM [${model.table}] WHERE [id] = ${this.data[columnKey]}`, (error: Error, row: any) => {
                if(error) { reject(error); return; }
                resolve(new model(row));
            })
        });
    }

    protected belongsToMany(model: any, table: string, columnKey: string, foreignKey: string): Promise<any> {
        return new Promise((resolve, reject) => {
            storage.db.all(`SELECT [${model.table}].* FROM [${table}] INNER JOIN [${table}].[${foreignKey}] = [${model.table}].[id] WHERE [${table}].[${columnKey}] = ${this.data.id}`, (error: Error, rows: any[]) => {
                if(error) { reject(error); return; }
                resolve(rows.map((row: any) => (new model(row))));
            });
        });
    }
}