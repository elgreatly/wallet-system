import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionRequestDto {

    @IsNumber()
    @IsNotEmpty()
    toUserId: number;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    constructor(data?: any) {
        Object.assign(this, data);
    }
}
