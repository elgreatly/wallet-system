import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Transaction, TransactionRepository, MoreThanOrEqual } from 'typeorm';
import { UserRepository } from './../../../app/shared/repositories/user.repository';
import { UserModel } from './../../../app/auth/models/user.model';
import { CreateTransactionRequestDto } from '../dto/request/create-transaction.request';
import { WalletTransactionModel } from '../models/wallet-transaction.model';
import { WalletTransactionRepository } from '../repositories/wallet-transaction.repository';
import { NotificationService } from './../../../app/shared/services/notification.service';
import { UserEntity } from './../../../app/shared/entities/user.entity';
import { WalletTransactionEtity } from '../entities/wallet-transaction.entity';
import * as moment from 'moment';
import { ListModel } from '../models/list.model';

@Injectable()
export class WalletService {

    constructor(
        private userRepository: UserRepository,
        private transactionRepository: WalletTransactionRepository,
        private notificationService: NotificationService,
    ) {}

    async getTransactions(limit: number, offset: number): Promise<ListModel<WalletTransactionModel[]>> {
        const count = await this.transactionRepository.getTransactionsCount();
        const transactions = await this.transactionRepository.getTransactions(limit, offset);

        return {
            count,
            list: transactions,
        };
    }

    async getUserTransactions(userId: number, limit: number, offset: number): Promise<ListModel<WalletTransactionModel[]>> {
        const count = await this.transactionRepository.getUserTransactionsCount(userId);
        const transactions = await this.transactionRepository.getUserTransactions(userId, limit, offset);

        return {
            count,
            list: transactions,
        };
    }

    async createTransaction(fromUser: UserModel, createTransactionDto: CreateTransactionRequestDto): Promise<void> {
        const users = await this.userRepository.getUsersByIds([fromUser.id, createTransactionDto.toUserId]);

        if (users.length < 2) {
            throw new HttpException('user not exists', HttpStatus.BAD_REQUEST);
        }

        const fromUserData = users.find(user => user.id === fromUser.id);

        if (fromUserData.walletBalance < createTransactionDto.amount) {
            throw new HttpException('user does not have enough balance', HttpStatus.BAD_REQUEST);
        }

        const transactionModel = new WalletTransactionModel({
            fromUser: new UserModel({
                id: fromUser.id,
            }),
            toUser: new UserModel({
                id: createTransactionDto.toUserId,
            }),
            amount: createTransactionDto.amount,
            isActive: false,
        });

        const createdTransaction = await this.transactionRepository.createTransaction(transactionModel);

        Logger.log(`Start fire a call to confirm transfer`);
        await this.notificationService.call(createdTransaction.id, fromUserData.phoneNumber);
    }

    @Transaction()
    async confirmTransaction(
        id: number,
        @TransactionRepository(UserEntity) userRebo: UserRepository = null,
        @TransactionRepository(WalletTransactionEtity) walletTransactionRebo: WalletTransactionRepository = null,
    ): Promise<void> {
        const transaction = await walletTransactionRebo.getTransactionById(id);
        if (transaction.isActive) {
            Logger.error('transaction already transfered');
        }
        Logger.log(`get transaction ${id} correctly`);

        if (moment() < moment(transaction.createdAt).add(5, 'minutes')) {
            const takeMoneyFromUser = await userRebo.takeMoneyFromUser(transaction);

            if (takeMoneyFromUser.affected === 0) {
                Logger.error('there is no enough balance');
            }

            Logger.log(`take money from user correctly`);

            const addMoneyToUser = await userRebo.addMoneyToUser(transaction);

            if (addMoneyToUser.affected === 0) {
                Logger.error('transaction not confirmed');
            }

            Logger.log(`add money to  user correctly`);

            transaction.isActive = true;

            await walletTransactionRebo.save(transaction);

            Logger.log(`Transaction Confirmed`);

        } else {
            Logger.error('transaction expired');
        }
    }
}
