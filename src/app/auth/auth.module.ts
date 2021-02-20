import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { CryptService } from './services/crypt.service';
import { SharedModule } from '../shared/shared.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService, CryptService],
    imports: [
        InfrastructureModule,
        SharedModule,
    ],
    exports: [],
})
export class AuthModule {}
