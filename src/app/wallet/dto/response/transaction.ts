import { UserDto } from './user.response';

export class TransactionDto {
    id: number;
    amount: number;
    isActive: boolean;
    createdAt: Date;
    currency: string;
    from: UserDto;
    to: UserDto;

    constructor(data?: any) {
        Object.assign(this, data);
    }
}
