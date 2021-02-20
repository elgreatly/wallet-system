import { WalletTransactionEtity } from './../../../app/wallet/entities/wallet-transaction.entity';
import {Column, Entity, PrimaryGeneratedColumn, OneToMany} from 'typeorm';

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({name: 'phone_number'})
    phoneNumber: string;

    @Column()
    password: string;

    @Column({name: 'wallet_balance'})
    walletBalance: number;

    @OneToMany(() => WalletTransactionEtity, transaction => transaction.fromUser)
    @OneToMany(() => WalletTransactionEtity, transaction => transaction.toUser)
    transactions: WalletTransactionEtity[];
}
