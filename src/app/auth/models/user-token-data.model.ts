export class UserTokenDataModel {

    id: number;
    name: string;
    phoneNumber: string;

    constructor(data?: Partial<UserTokenDataModel>) {
        Object.assign(this, data);
    }
}
