import { UserModel } from '../../auth/models/user.model';

export class ListModel<T> {

    count: number;
    list: T;

    constructor(data?: Partial<ListModel<T>>) {
        Object.assign(this, data);
    }
}
