import Model from './model';
import Transaction from './transaction';
import Budget from './budget';

export default class Account extends Model {
    protected static table = 'accounts';

    public transactions() { return this.hasMany(Transaction, 'account_id'); }
    public budgets() { return this.belongsToMany(Budget, 'budgets_to_accounts', 'account_id', 'budget_id'); }

    public subAccounts(): Promise<Account[]> { return this.hasMany(Account, 'parent_id'); }
    public parent(): Promise<Account[]> { return this.belongTo(Account, 'parent_id'); }

    public static all(): Promise<Account[]> { return super.all(); }
}