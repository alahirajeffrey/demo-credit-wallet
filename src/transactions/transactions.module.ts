import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AccountService } from 'src/account/account.service';

@Module({
  providers: [TransactionsService, AccountService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
