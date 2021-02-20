import { Controller, Get, Post, Param, HttpCode, Body, Req, Res, Logger, Query } from '@nestjs/common';
import { CreateTransactionRequestDto } from './dto/request/create-transaction.request';
import { GetTransactionsResponseDto } from './dto/response/get-transactions.response';
import { WalletService } from './services/wallet.service';

@Controller('wallet')
export class WalletController {

    constructor(
        private walletService: WalletService,
    ) {}

    @Get('/transactions')
    @HttpCode(200)
    async getTransactions(@Query('limit') limit: number, @Query('offset') offset: number): Promise<GetTransactionsResponseDto> {
        const transactions = await this.walletService.getTransactions(limit, offset);

        return {
            count: transactions.count,
            transactions: transactions.list.map(transaction => {
                return {
                    id: transaction.id,
                    amount: transaction.amount,
                    isActive: transaction.isActive,
                    createdAt: transaction.createdAt,
                    currency: transaction.currency,
                    from: {
                        id: transaction.fromUser.id,
                        name: transaction.fromUser.name,
                    },
                    to: {
                        id: transaction.toUser.id,
                        name: transaction.toUser.name,
                    },
                };
            }),
        };
    }

    @Get('/transactions/users')
    @HttpCode(200)
    async getUserTransactions(@Req() req, @Query('limit') limit: number, @Query('offset') offset: number): Promise<GetTransactionsResponseDto> {
        const transactions = await this.walletService.getUserTransactions(req.user.id, limit, offset);

        return {
            count: transactions.count,
            transactions: transactions.list.map(transaction => {
                return {
                    id: transaction.id,
                    amount: transaction.amount,
                    isActive: transaction.isActive,
                    createdAt: transaction.createdAt,
                    currency: transaction.currency,
                    from: {
                        id: transaction.fromUser.id,
                        name: transaction.fromUser.name,
                    },
                    to: {
                        id: transaction.toUser.id,
                        name: transaction.toUser.name,
                    },
                };
            }),
        };
    }

    @Post('/transactions')
    @HttpCode(200)
    async createTransaction(@Req() req, @Body() createTransactionDto: CreateTransactionRequestDto): Promise<string> {
        Logger.log(`Start create new transaction`);
        await this.walletService.createTransaction(req.user, createTransactionDto);

        return 'Transaction Created Successfully and you will get a call now to confirm your transfer';
    }

    @Post('/transactions/confirm/:id')
    @HttpCode(200)
    async confirmTransaction(@Res() response: any, @Body() body: any, @Param('id') id: number): Promise<void> {
        Logger.log(`start confirmed transaction with user input digits ${body.Digits} for trasaction id: ${id}`);
        const VoiceResponse = require('twilio').twiml.VoiceResponse;
        const twiml = new VoiceResponse();
        switch (body.Digits) {
            case '123':
                Logger.log(`confirmed, we will work to handle your transfer`);
                twiml.say('confirmed, we will work to handle your transfer');
                this.walletService.confirmTransaction(id);
                break;
            default:
                Logger.error(`Sorry, you added wrong number, we will block your transfer, try another one if you need`);
                twiml.say('Sorry, you added wrong number, we will block your transfer, try another one if you need');
                twiml.say('Thanks for calling');
                twiml.say('Good Bay!');
                break;
        }

        response.type('text/xml');
        response.send(twiml.toString());
    }
}
