import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { LoginRequestDto } from './dto/request/login.request';
import { RegisterRequestDto } from './dto/request/register.request';
import { LoginRegisterResponseDto } from './dto/response/login-register.response';
import { AuthService } from './services/auth.service';

@Controller('')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) {}

    @Post('register')
    @HttpCode(200)
    async register(@Body() registerReq: RegisterRequestDto): Promise<LoginRegisterResponseDto> {
        const token: string = await this.authService.register(registerReq);

        return {
            accessToken: token,
        };
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginReq: LoginRequestDto): Promise<LoginRegisterResponseDto> {
        const token: string = await this.authService.login(loginReq);

        return {
            accessToken: token,
        };
    }
}
