export class UserModel {

    id: number;
    name: string;
    phoneNumber: string;
    password?: string;
    walletBalance: number;

    constructor(data?: Partial<UserModel>) {
        Object.assign(this, data);
    }
}
