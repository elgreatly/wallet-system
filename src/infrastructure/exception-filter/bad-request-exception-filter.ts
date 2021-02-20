import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        // @ts-ignore
        const i18n = ctx.args[0].i18nService;
        // @ts-ignore
        const lang = ctx.args[0].i18nLang;
        const status = exception.getStatus();
        Logger.log(exception);
        let errors = [];
        if (Array.isArray(exception.message.message)) {
            errors = exception.message.message.map(err => {
                const errorMessages = [];
                Object.keys(err.constraints).forEach((key: string) => {
                    const message = err.constraints[key];
                    const errMessage =
                        (err.contexts && err.contexts[key] && err.contexts[key][0] === 'translated') || key === 'IsDateFormat'
                            ? i18n.translate(message, { lang })
                            : message;
                    errorMessages.push(errMessage);
                });
                return {
                    field: err.property,
                    message: errorMessages,
                };
            });
        }
        response.status(status).json({
            status,
            message: Array.isArray(exception.message.message) ? exception.message.error : exception.message.message,
            errors,
        });
    }
}
