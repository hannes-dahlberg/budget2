export type entity = { [key:string]: any };
export type orderDirective = { name: string, descending?: boolean };

export class Collection {
    private _table: string;
    private _select: string = '*';
    private _where: string;
    private _order: string;

    public table(table: string): Collection {
        this._table = table;
        return this;
    }
    public select(columns: string[]): Collection {
        this._select = columns.map(column => '[' + column + ']').join(', ');
        return this;
    }
    public where(column: string, operator: string, value: string): Collection {
        this._where += '[' + column + '] ' + operator + ' \'' + value + '\' ';
        return this;
    }

    public order(columns: orderDirective[]) {
        this._order = columns.map(column => '[' + column.name + ']' + (column.descending ? ' DESC' : '')).join(', ');
    }

    private entityKeys(data: entity): string {
        return this.enclosed(Object.keys(data));
    }
    private entityValues(data: entity): string {
        return Object.keys(data).map(key => '\'' + data[key] + '\'').join(', ')
    }
    private enclosed(values: string[]): string {
        return values.map(value => '[' + value + ']').join(', ');
    }
}
export class Entity {


}