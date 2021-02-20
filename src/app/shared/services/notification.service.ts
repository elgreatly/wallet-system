import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { config } from '../../../infrastructure/config/config.service';

@Injectable()
export class NotificationService {

    client: any;

    constructor() {
        const accountSid = config.getString('TWILIO_ACCOUNT_SID');
        const authToken = config.getString('TWILIO_AUTH_TOKEN');
        this.client = require('twilio')(accountSid, authToken);
    }

    async call(transactionId: number, phoneNumber: string): Promise<void> {
        const VoiceResponse = require('twilio').twiml.VoiceResponse;
        const twiml = new VoiceResponse();
        const gatherNode = twiml.gather({
            numDigits: 3,
            action: `${config.getString('TWILIO_GATHER_WEBHOOK')}/${transactionId}`,
        });
        gatherNode.say('please press 1 2 3 to confirm your transfer.');
        this.client.calls
            .create({
                twiml: twiml.toString(),
                to: phoneNumber,
                from: config.getString('TWILIO_PHONE_NUMBER'),
            })
            .then(
                call => {
                    Logger.log(call.sid);
                },
                err => {
                    Logger.error(err);
                },
            );
    }
}
