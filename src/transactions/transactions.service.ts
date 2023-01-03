import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { FundAccountDto } from './dto/fund-account.dto';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { WithdrawFundsDto } from './dto/withdraw-funds.dto';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async fundAccount(dto: FundAccountDto) {
    try {
      return 'Coming soon';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async withdrawFunds(dto: WithdrawFundsDto) {
    try {
      return 'Coming soon';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async tranferFunds(dto: TransferFundsDto) {
    try {
      return 'Coming soon';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
