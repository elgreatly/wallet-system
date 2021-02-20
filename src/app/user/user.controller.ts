import { Controller, Get, Post, HttpStatus, Query, Param, ParseIntPipe, HttpException, HttpCode, Body, Req } from '@nestjs/common';
import { UserService } from './services/user.service';

@Controller('users')
export class UserController {

    constructor(
        private userService: UserService,
    ) {}

    @Get('wallet-balance')
    @HttpCode(200)
    async walletBalance(@Req() req): Promise<any> {
        return await this.userService.getWalletBalance(req.user.id);
    }
}
