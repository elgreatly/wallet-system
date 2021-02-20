import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    constructor(data?: any) {
        Object.assign(this, data);
    }
}
