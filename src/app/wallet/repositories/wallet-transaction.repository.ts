import { EntityRepository, Repository, MoreThanOrEqual } from 'typeorm';
import { WalletTransactionEtity } from '../entities/wallet-transaction.entity';
import { WalletTransactionModel } from '../models/wallet-transaction.model';
import { UserModel } from './../../../app/auth/models/user.model';

@EntityRepository(WalletTransactionEtity)
export class WalletTransactionRepository extends Repository<WalletTransactionEtity> {

    constructor() {
        super();
    }

    async getTransactionsCount(): Promise<number> {
        return await this.createQueryBuilder('transaction')
            .innerJoinAndSelect('transaction.fromUser', 'fromUser')
            .innerJoinAndSelect('transaction.toUser', 'toUser')
            .getCount();
    }

    async getTransactions(limit: number, offset: number): Promise<WalletTransactionModel[]> {
        const transactions = await this.createQueryBuilder('transaction')
            .innerJoinAndSelect('transaction.fromUser', 'fromUser')
            .innerJoinAndSelect('transaction.toUser', 'toUser')
            .select('transaction.*, fromUser.id AS fromUserId, fromUser.name AS fromUserName, toUser.id AS toUserId, toUser.name AS toUserName')
            .offset(offset)
            .limit(limit)
            .orderBy('id')
            .getRawMany();

        return transactions.map(transaction =>
            new WalletTransactionModel({
                id: transaction.id,
                amount: transaction.amount,
                isActive: transaction.is_active,
                createdAt: transaction.created_at,
                fromUser: new UserModel({
                    id: transaction.fromUserId,
                    name: transaction.fromUserName,
                }),
                toUser: new UserModel({
                    id: transaction.toUserId,
                    name: transaction.toUserName,
                }),
            }),
        );
    }

    async getUserTransactionsCount(userId: number): Promise<number> {
        return await this.createQueryBuilder('transaction')
            .innerJoinAndSelect('transaction.fromUser', 'fromUser')
            .innerJoinAndSelect('transaction.toUser', 'toUser')
            .where('transaction.fromUserId = :userId', {userId})
            .orWhere('transaction.toUserId = :userId', {userId})
            .getCount();
    }

    async getUserTransactions(userId: number, limit: number, offset: number): Promise<WalletTransactionModel[]> {
        const transactions = await this.createQueryBuilder('transaction')
            .innerJoinAndSelect('transaction.fromUser', 'fromUser')
            .innerJoinAndSelect('transaction.toUser', 'toUser')
            .select('transaction.*, fromUser.id AS fromUserId, fromUser.name AS fromUserName, toUser.id AS toUserId, toUser.name AS toUserName')
            .where('transaction.fromUserId = :userId', {userId})
            .orWhere('transaction.toUserId = :userId', {userId})
            .offset(offset)
            .limit(limit)
            .orderBy('id')
            .getRawMany();

        return transactions.map(transaction =>
            new WalletTransactionModel({
                id: transaction.id,
                amount: transaction.amount,
                isActive: transaction.is_active,
                createdAt: transaction.created_at,
                fromUser: new UserModel({
                    id: transaction.fromUserId,
                    name: transaction.fromUserName,
                }),
                toUser: new UserModel({
                    id: transaction.toUserId,
                    name: transaction.toUserName,
                }),
            }),
        );
    }

    public async getTransactionById(id: number): Promise<WalletTransactionModel> {
        const transaction = await this.findOne({id});

        return transaction ? this.mapToTransactionModel(transaction) : null;
    }

    public async createTransaction(transaction: WalletTransactionModel): Promise<WalletTransactionModel> {
        const walletTransactionEntity: WalletTransactionEtity = new WalletTransactionEtity();
        walletTransactionEntity.fromUserId = transaction.fromUser.id;
        walletTransactionEntity.toUserId = transaction.toUser.id;
        walletTransactionEntity.amount = transaction.amount;
        walletTransactionEntity.isActive = transaction.isActive;

        const createdTransaction = await this.save(transaction);

        return this.mapToTransactionModel(createdTransaction);
    }

    mapToTransactionModel(transaction: WalletTransactionEtity): WalletTransactionModel {
        return {
            id: transaction.id,
            fromUser: new UserModel({
                id: transaction.fromUserId,
            }),
            toUser: new UserModel({
                id: transaction.toUserId,
            }),
            amount: transaction.amount,
            isActive: transaction.isActive,
            createdAt: transaction.createdAt,
        };
    }

}
