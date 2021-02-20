export class UserDto {
    id: number;
    name: string;

    constructor(data?: any) {
        Object.assign(this, data);
    }
}
