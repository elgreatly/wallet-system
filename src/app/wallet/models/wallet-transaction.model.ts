import { UserModel } from './../../../app/auth/models/user.model';

export class WalletTransactionModel {

    id?: number;
    fromUser: UserModel;
    toUser: UserModel;
    amount: number;
    currency?: string;
    isActive: boolean;
    createdAt: Date;

    constructor(data?: Partial<WalletTransactionModel>) {
        Object.assign(this, data);
    }
}
