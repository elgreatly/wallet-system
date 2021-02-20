import { EntityRepository, Repository, MoreThanOrEqual } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserModel } from '../../auth/models/user.model';
import { WalletTransactionModel } from './../../../app/wallet/models/wallet-transaction.model';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {

    constructor() {
        super();
    }

    public async register(user: UserModel): Promise<UserModel> {
        const userEntity: UserEntity = new UserEntity();
        userEntity.name = user.name;
        userEntity.phoneNumber = user.phoneNumber;
        userEntity.password = user.password;
        userEntity.walletBalance = user.walletBalance;

        const createdUser = await this.save(userEntity);

        return this.mapToUserModel(createdUser);
    }

    async getUserByPhoneNumber(phoneNumber: string): Promise<UserModel> {

        const user = await this.findOne({phoneNumber});

        return user ? this.mapToUserModel(user) : null;
    }

    async getUserById(id: number): Promise<UserModel> {

        const user = await this.findOne({id});

        return user ? this.mapToUserModel(user) : null;
    }

    async getUsersByIds(ids: number[]): Promise<UserModel[]> {

        const users = await this.createQueryBuilder('user')
            .where('user.id IN (:ids)', { ids })
            .getMany();

        return users.map(user => this.mapToUserModel(user));
    }

    async takeMoneyFromUser(transaction: WalletTransactionModel): Promise<any> {
        return await this.createQueryBuilder()
                .update(UserEntity)
                .where({id: transaction.fromUser.id, walletBalance: MoreThanOrEqual(transaction.amount)})
                .set({ walletBalance: () => `wallet_balance - ${transaction.amount}` })
                .execute();
    }

    async addMoneyToUser(transaction: WalletTransactionModel): Promise<any> {
        return await this.createQueryBuilder()
            .update(UserEntity)
            .where({id: transaction.toUser.id})
            .set({ walletBalance: () => `wallet_balance + ${transaction.amount}` })
            .execute();
    }

    private mapToUserModel(user: UserEntity): UserModel {
        return new UserModel({
            id: user.id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            password: user.password,
            walletBalance: user.walletBalance,
        });
    }

}
