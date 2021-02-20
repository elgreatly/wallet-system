import { HttpException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../../shared/repositories/user.repository';
import * as jwt from 'jsonwebtoken';
import { config } from './../../../infrastructure/config/config.service';
import { RegisterRequestDto } from '../dto/request/register.request';
import { UserModel } from '../models/user.model';
import { CryptService } from './crypt.service';
import { LoginRequestDto } from '../dto/request/login.request';
import { UserTokenDataModel } from '../models/user-token-data.model';

@Injectable()
export class AuthService {

    constructor(
        private cryptService: CryptService,
        private userRepository: UserRepository,
    ) {}

    async register(registerReq: RegisterRequestDto): Promise<string> {
        const hashedPassword = await this.cryptService.hash(registerReq.password);

        const userModel = new UserModel({
            name: registerReq.name,
            phoneNumber: registerReq.phoneNumber,
            password: hashedPassword,
            walletBalance: 1000,
        });

        const user = await this.userRepository.getUserByPhoneNumber(userModel.phoneNumber);

        if (user) {
            throw new HttpException('this phone number already exist', 400);
        }

        const createdUser = await this.userRepository.register(userModel);

        const userTokenData = this.getUserTokenData(createdUser);
        return jwt.sign({userTokenData}, config.getString('SECRET_TOKEN'), { expiresIn: '1h' });
    }

    async login(loginReq: LoginRequestDto): Promise<string> {

        const user = await this.userRepository.getUserByPhoneNumber(loginReq.phoneNumber);

        if (!user) {
            throw new HttpException('wrong phone number or password', 400);
        }

        const isCorrectPassword = await this.cryptService.compare(loginReq.password, user.password);

        if (isCorrectPassword) {
            const userTokenData = this.getUserTokenData(user);
            return jwt.sign({userTokenData}, config.getString('SECRET_TOKEN'), { expiresIn: '1h' });
        }

        throw new HttpException('wrong phone number or password', 400);
    }

    private getUserTokenData(user: UserModel): UserTokenDataModel {
        return {
            id: user.id,
            name: user.name,
            phoneNumber: user.phoneNumber,
        };
    }
}
