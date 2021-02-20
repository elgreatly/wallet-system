import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config/config.service';

@Module({
    providers: [],
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: config.getString('TYPEORM_HOST'),
            port: config.getNumber('TYPEORM_PORT'),
            username: config.getString('TYPEORM_USERNAME'),
            password: config.getString('TYPEORM_PASSWORD'),
            database: config.getString('TYPEORM_DATABASE'),
            migrations: config.getString('TYPEORM_MIGRATIONS').split(','),
            entities: config.getString('TYPEORM_ENTITIES').split(','),
            synchronize: false,
            logging: true,
        }),

    ],
    exports: [],
})
export class DatabaseModule {}
