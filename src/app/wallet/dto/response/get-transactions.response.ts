import { TransactionDto } from './transaction';

export class GetTransactionsResponseDto {
    count: number;
    transactions: TransactionDto[];

    constructor(data?: any) {
        Object.assign(this, data);
    }
}
