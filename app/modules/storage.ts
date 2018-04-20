import * as sqlite3 from 'sqlite3';

export type entity = { [key:string]: any };

export type tableDirective = string;
export type selectDirective = string;
export type whereDirective = string|[string, string, string|number]|{ column: string, operator: string, value: string|number}
export type orderByDirective = string|[string, boolean]|{ column: string, desc: boolean }
export type limitDiretive = number|[number, number];

class Storage {
    //Helpers for initiating a singleton of the class
    private static instance: Storage;
    static getInstance() { return Storage.instance || (Storage.instance = new Storage()); }

    public db: sqlite3.Database;

    private constructor() {
        this.db = new (sqlite3.verbose()).Database('storage/db.sqlite', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE)
    }

    public init(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.checkTable('users').then(exists => {
                if(!exists) {
                    this.db.exec(`
                        CREATE TABLE [users] (
                            [id] INTEGER PRIMARY KEY,
                            [email] VARCHAR(255),
                            [password] VARCHAR(60)
                        );

                        CREATE TABLE [groups] (
                            [id] INTEGER PRIMARY KEY,
                            [name] VARCHAR(255)
                        );

                        CREATE TABLE [users_to_groups] (
                            [id] INTEGER PRIMARY KEY,
                            [user_id] INT,
                            [group_id] INT,
                            [owner] BOOLEAN
                        );

                        CREATE TABLE [verifications] (
                            [id] INTEGER PRIMARY KEY,
                            [description] TEXT,
                            [date] DATE,
                            [period] DATE
                        );

                        CREATE TABLE [transactions] (
                            [id] INTEGER PRIMARY KEY,
                            [amount] FLOAT,
                            [verification_id] INT,
                            [account_id] INT
                        );

                        CREATE TABLE [accounts] (
                            [id] INTEGER PRIMARY KEY,
                            [name] VARCHAR(255),
                            [parent_id] INT
                        );

                        CREATE TABLE [budgets] (
                            [id] INTEGER PRIMARY KEY,
                            [name] VARCHAR(255),
                            [description] TEXT,
                            [sum] FLOAT,
                            [recurrency] VARCHAR(255),
                            [start] DATE,
                            [end] DATE
                        );

                        CREATE TABLE [budgets_to_accounts] (
                            [id] INTEGER PRIMARY KEY,
                            [budget_id] INT,
                            [account_id] INT
                        );
                    `, (error: Error) => {
                        if(error) { reject(error); return; }
                        resolve();
                    });
                } else {
                    resolve();
                }
            })
        });
    }

    public checkTable(tableName: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT COUNT(*) as [count] FROM sqlite_master WHERE name = '` + tableName + `' and type = 'table'`, (error: Error, result: any) => {
                if(error) { reject(error); return; }
                resolve(!!result.count);
            });
        });
    }

    public getFromId({ table, id }: { table: string, id: number }): Promise<entity> {
        return new Promise((resolve, reject) => {
            //Get row from table with provided id
            this.db.get(`SELECT * FROM [` + table + `] WHERE id = ` + id, (error: Error, row: any) => {
                //Reject on error
                if(error) { reject(error); return; }

                //Resolve row
                resolve(row);
            });
        })
    }

    public getTable({ table }: { table: string }): Promise<entity[]> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM [` + table + `]`, (error: Error, rows: any[]) => {
                if(error) { reject(error); return; }
                resolve(rows);
            });
        });
    }

    public get({ table, select, where, orderBy, limit }: { table: tableDirective, select?: selectDirective|selectDirective[], where?: whereDirective|whereDirective[], orderBy?: orderByDirective|orderByDirective[], limit?: limitDiretive }): Promise<entity[]> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT `
                + (select ? this.prepareSelectStatement(select) : '*')
                + ` FROM [${table}]`
                + (where ? ` ` + this.prepareWhereStatement(where) : ``)
                + (orderBy ? ` ` + this.prepareOrderByStatement(orderBy) : ``)
                + (limit ? ` ` + this.prepareLimitStatement(limit) : ``), (error: Error, rows: any[]) => {
                    if(error) { reject(error); return; }
                    resolve(rows);
                });
        });
    }
    private prepareSelectStatement(select: selectDirective|selectDirective[]): string {
        if(typeof select === 'string') {
            return select;
        } else if(select instanceof Array) {
            return select.map((select: string) => `[${select}]`).join(', ');
        }
    }
    private prepareWhereStatement = function(where: whereDirective|whereDirective[], andOr: string = 'and', root: boolean = true): string {
        if(typeof where === 'string') {
            return where;
        } else if(where instanceof Array) {
            if(where.length == 3 && typeof where[0] === 'string' && typeof where[1] === 'string' && (typeof where[2] === 'string' || typeof where[2] === 'number')) {
                return (root ? `WHERE ` : ``) + `[${where[0]}] ${where[1]} ` + (typeof where[2] === 'string' ? `'${where[2]}'` : `${where[2]}`);
            } else {
                return `WHERE ` + (where as any).map((where: whereDirective) => this.prepareWhereStatement(where, andOr, false)).join(` ` + andOr.toUpperCase() + ` `);
            }
        } else {
            return (root ? `WHERE ` : ``) + `[${where.column}] ${where.operator} ` + (typeof where.value === 'string' ? `'${where.value}'` : `${where.value}`);
        }
    }
    private prepareOrderByStatement(orderBy: orderByDirective|orderByDirective[], root: boolean = true): string {
        if(typeof orderBy === 'string') {
            return orderBy;
        } else if (orderBy instanceof Array) {
            if(orderBy.length == 3 && typeof orderBy[0] === 'string' && typeof orderBy[1] === 'boolean') {
                return (root ? `ORDER BY `: ``) + `[${orderBy[0]}]` + (orderBy[1] ? ` DESC` : ``);
            } else {
                return 'ORDER BY ' + (orderBy as any).map((orderBy: orderByDirective) => this.prepareOrderByStatement(orderBy, false)).join(`, `);
            }
        } else {
            return (root ? `ORDER BY `: ``) + `[${orderBy.column}]` + (orderBy.desc ? ` DESC` : ``);
        }
    }
    private prepareLimitStatement(limit: limitDiretive): string {
        if(typeof limit === 'number') {
            return `LIMIT ` + limit.toString();
        } else {
            return `LIMIT ${limit[0]}, ${limit[1]}`;
        }
    }

    public insert({ data, table }: { data: entity, table: string }): Promise<entity> {
        return new Promise((resolve, reject) => {
            //Set this to _self
            let _self = this;

            //Run insert statement
            this.db.run(`INSERT INTO [` + table + `] (` + this.entityKeys(data) + `) VALUES(` + this.entityValues(data) + `)`,function(error: Error) {
                //Reject on error
                if(error) { reject(error); return; }

                //Resolve inserted row
                _self.getFromId({ table, id: this.lastID }).then((row: entity) => resolve(row)).catch((error: Error) => reject(error));
            });
        });
    }
    public update({ data, table }: { data: entity, table: string }): Promise<entity> {
        return new Promise((resolve, reject) => {
            //Reject if data has no ID property
            if(!data.id) { reject(new Error('provided data has no ID value')); return; }

            //Save ID to variable and delete it from data object
            let id = data.id;
            delete data.id;

            //Run update statement
            this.db.run(`UPDATE [` + table + `] SET ` + this.entitySetValues(data) + ` WHERE [id] = ` + id.toString(), (error: Error) => {
                //Reject on error
                if(error) { reject(error); return; }

                //Resolve updated row
                this.getFromId({ table, id }).then((row: entity) => resolve(row)).catch((error: Error) => reject(error));
            });
        });
    }
    public delete({ table, id }: { table: string, id: number }): Promise<void> {
        return new Promise((resolve, reject) => {
            //Run delete statement
            this.db.run(`DELETE FROM [` + table + `] where [id] = ` + id.toString(), (error: Error) => {
                //Reject on error
                if(error) { reject(error); return; }

                //Resolve on success
                resolve();
            });
        });
    }

    private entityKeys(data: entity): string {
        return Object.keys(data).map(key => '[' + key + ']').join(', ');
    }
    private entityValues(data: entity): string {
        return Object.keys(data).map(key => '\'' + data[key] + '\'').join(', ');
    }
    private entitySetValues(data: entity): string {
        return Object.keys(data).map(key => '[' + key + '] = \'' + data[key] + '\'').join(', ');
    }
}

export let storage = Storage.getInstance();