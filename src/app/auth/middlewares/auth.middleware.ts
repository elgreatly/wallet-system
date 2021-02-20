import { Injectable, NestMiddleware, Response, UnauthorizedException, UseFilters } from '@nestjs/common';
import { UnauthorizedExceptionFilter } from '../../../infrastructure/exception-filter/unauthorized-exception-filter';
import * as jwt from 'jsonwebtoken';
import { config } from './../../../infrastructure/config/config.service';
import { UserModel } from '../models/user.model';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    @UseFilters(UnauthorizedExceptionFilter)
    async use(request: any, res: Response, next: () => void) {
        const token = request.headers.authorization?.replace('Bearer ', '');
        try {
            const decoded: any = jwt.verify(token, config.getString('SECRET_TOKEN'));
            const user = new UserModel({
                id: decoded.userTokenData.id,
                name: decoded.userTokenData.name,
                phoneNumber: decoded.userTokenData.phoneNumber,
            });

            request.user = user;
        } catch (err) {
            throw new UnauthorizedException('Unauthorized');
        }

        next();
    }
}
