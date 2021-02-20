import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './app/auth/auth.module';
import { HttpExceptionFilter } from './infrastructure/exception-filter/exception-filter';
import { UnauthorizedExceptionFilter } from './infrastructure/exception-filter/unauthorized-exception-filter';
import { AuthMiddleware } from './app/auth/middlewares/auth.middleware';
import { WalletModule } from './app/wallet/wallet.module';
import { UserModule } from './app/user/user.module';
import { BadRequestExceptionFilter } from './infrastructure/exception-filter/bad-request-exception-filter';

@Module({
    imports: [
        InfrastructureModule,
        ScheduleModule.forRoot(),
        AuthModule,
        WalletModule,
        UserModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_FILTER,
            useClass: BadRequestExceptionFilter,
        },
        {
            provide: APP_FILTER,
            useClass: UnauthorizedExceptionFilter,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(AuthMiddleware)
        .forRoutes(
            { path: 'wallet/transactions', method: RequestMethod.POST },
            { path: 'users/wallet-balance', method: RequestMethod.GET },
            { path: 'wallet/transactions/users', method: RequestMethod.GET },
        );
    }
}
