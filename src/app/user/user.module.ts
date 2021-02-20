import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { UserController } from './user.controller';
import { SharedModule } from '../shared/shared.module';
import { UserService } from './services/user.service';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        InfrastructureModule,
        SharedModule,
    ],
    exports: [],
})
export class UserModule {}
