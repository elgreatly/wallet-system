import { HttpException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../../shared/repositories/user.repository';

@Injectable()
export class UserService {

    constructor(
        private userRepository: UserRepository,
    ) {}

    async getWalletBalance(userId: number): Promise<number> {

        const user = await this.userRepository.getUserById(userId);

        if (!user) {
            throw new HttpException('user Not Exist', 400);
        }

        return user.walletBalance;
    }
}
