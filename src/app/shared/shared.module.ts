import { Module } from '@nestjs/common';
import { UserRepository } from './../../app/shared/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './services/notification.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
    ],
    providers: [NotificationService],
    exports: [TypeOrmModule, NotificationService],
})
export class SharedModule {}
