import { UserEntity } from './../../../app/shared/entities/user.entity';
import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';

@Entity('wallet_transactions')
export class WalletTransactionEtity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'from_user_id'})
    fromUserId: number;

    @Column({name: 'to_user_id'})
    toUserId: number;

    @Column()
    amount: number;

    @Column({name: 'currency'})
    currency: string;

    @Column({name: 'created_at'})
    createdAt: Date;

    @Column({name: 'is_active'})
    isActive: boolean;

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn({ name: 'from_user_id' })
    fromUser: UserEntity;

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn({ name: 'to_user_id' })
    toUser: UserEntity;

}
