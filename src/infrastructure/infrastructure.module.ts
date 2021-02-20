import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './Database/database.module';

@Module({
    imports: [
        ConfigModule,
        HttpModule,
        DatabaseModule,
    ],
    providers: [],
    exports: [],
})
export class InfrastructureModule {
}
