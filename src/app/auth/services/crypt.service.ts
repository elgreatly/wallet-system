import { Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptService {
    saltRounds = 10;
    salt;

    constructor() {
        this.salt = bcrypt.genSaltSync(this.saltRounds);
    }

    async hash(plianText: string): Promise<string> {
        return bcrypt.hashSync(plianText, this.salt);
    }

    async compare(plianText: string, hash: string): Promise<boolean> {
        return bcrypt.compareSync(plianText, hash);
    }

}
