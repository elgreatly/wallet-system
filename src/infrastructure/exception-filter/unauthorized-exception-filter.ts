import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        Logger.log(exception);
        response.status(status).json({
            status,
            message: exception.message.message,
        });
    }
}
