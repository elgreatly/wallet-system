import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './services/wallet.service';
import { SharedModule } from '../shared/shared.module';
import { WalletTransactionRepository } from './repositories/wallet-transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    controllers: [WalletController],
    providers: [WalletService],
    imports: [
        InfrastructureModule,
        SharedModule,
        TypeOrmModule.forFeature([WalletTransactionRepository]),
    ],
    exports: [],
})
export class WalletModule {}
