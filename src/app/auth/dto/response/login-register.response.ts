export class LoginRegisterResponseDto {
    accessToken: string;

    constructor(data?: any) {
        Object.assign(this, data);
    }
}
