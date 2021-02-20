import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from './infrastructure/config/config.service';
import { ResponseTransformInterceptor } from './infrastructure/interceptors/response-transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );

    app.useGlobalInterceptors(new ResponseTransformInterceptor());

    app.setGlobalPrefix('api/v1');

    await app.listen(process.env.PORT || config.getNumber('APP_PORT'));
}

bootstrap();
