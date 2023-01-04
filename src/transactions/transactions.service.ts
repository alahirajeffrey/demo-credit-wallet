import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { AccountService } from 'src/account/account.service';
import { TransactionTypeEnum } from 'src/enums/transaction-type.enum';
import { SuccessMessage } from 'src/interfaces/success-message.interface';
import { FundAccountDto } from './dto/fund-account.dto';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { WithdrawFundsDto } from './dto/withdraw-funds.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly accountService: AccountService,
  ) {}

  /**
   * function to fund a user's account
   * @param dto : fund account dto
   * @returns : a success message
   */
  async fundAccount(dto: FundAccountDto): Promise<SuccessMessage> {
    try {
      //get current balance
      const accountDetails = await this.accountService.getAccountDetails(
        dto.accountEmail,
      );
      const currentBalance = accountDetails[0].balance;
      //add amount to balance
      const newBalance = currentBalance + dto.amount;
      //update amount in accounts
      await this.knex
        .table('accounts')
        .where('userEmail', dto.accountEmail)
        .update('balance', newBalance);

      //save transaction
      await this.knex.table('transactions').insert({
        transactionType: TransactionTypeEnum.funding,
        amount: dto.amount,
        accountEmail: dto.accountEmail,
        isTransactionSuccessful: true,
      });

      return { message: 'account funded successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   *  function that returns a user's transactions
   * @param email : string
   * @returns : user's transactions
   */
  async getUserTransactions(email: string) {
    try {
      return await this.knex.table('transactions').where('accountEmail', email);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * function to withdraw funds from a user's account
   * @param dto : withdraw funds dto
   * @returns : a success message
   */
  async withdrawFunds(dto: WithdrawFundsDto): Promise<SuccessMessage> {
    try {
      //check if user has enough balance for the transaction
      const accountDetails = await this.accountService.getAccountDetails(
        dto.accountEmail,
      );
      const accountBalance = accountDetails[0].balance;
      if (dto.amount > accountBalance) {
        throw new HttpException('insufficient balance', HttpStatus.FORBIDDEN);
      }
      //deduct amount from account balances
      const balanceAfterWithdrawal = accountBalance - dto.amount;
      //update account
      await this.knex
        .table('accounts')
        .where('userEmail', dto.accountEmail)
        .update('balance', balanceAfterWithdrawal);
      //save transaction
      await this.knex.table('transactions').insert({
        transactionType: TransactionTypeEnum.withdrawal,
        amount: dto.amount,
        accountEmail: dto.accountEmail,
        isTransactionSuccessful: true,
      });

      return { message: 'withdrawal successful' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * function to transfer funds from one user to another
   * @param dto : transfer funds dto
   * @returns : a success message
   */
  async tranferFunds(dto: TransferFundsDto): Promise<SuccessMessage> {
    try {
      //check if user has enough balance to transfer
      const senderAccountDetails = await this.accountService.getAccountDetails(
        dto.accountEmail,
      );

      const senderAccountBalance = senderAccountDetails[0].balance;
      if (dto.amount > senderAccountBalance) {
        throw new HttpException('insufficient balance', HttpStatus.FORBIDDEN);
      }

      //check if reciever email is valid
      const recieverExists = await this.knex
        .table('accounts')
        .where('userEmail', dto.recieverEmail);
      if (!recieverExists) {
        throw new HttpException(
          'reciever does not exist',
          HttpStatus.FORBIDDEN,
        );
      }
      //update reciever's account
      const recieverAccountBalanceAfterTransfer =
        recieverExists[0].balance + dto.amount;
      console.log(recieverExists);
      console.log(recieverAccountBalanceAfterTransfer);

      await this.knex
        .table('accounts')
        .where('userEMail', dto.recieverEmail)
        .update('balance', recieverAccountBalanceAfterTransfer);

      //update sender's account
      const senderAccountBalanceAfterTransfer =
        senderAccountBalance - dto.amount;

      await this.knex
        .table('accounts')
        .where('userEmail', dto.accountEmail)
        .update('balance', senderAccountBalanceAfterTransfer);
      //save transaction
      await this.knex.table('transactions').insert({
        transactionType: TransactionTypeEnum.transfer,
        amount: dto.amount,
        accountEmail: dto.accountEmail,
        isTransactionSuccessful: true,
        recieverEmail: dto.recieverEmail,
      });
      return { message: 'transfer successful' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
