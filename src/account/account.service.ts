import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { Account } from 'src/interfaces/account.interface';
import { SuccessMessage } from 'src/interfaces/success-message.interface';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  /**
   * function to create an account for a user
   * @param dto : create account dto
   * @returns a success message
   */
  async createAccount(dto: CreateAccountDto): Promise<SuccessMessage> {
    try {
      //check to see if user already has an account
      const accountExists = await this.knex
        .table('accounts')
        .where('userEmail', dto.userEmail);
      if (accountExists.length > 0) {
        throw new HttpException('account already exists', HttpStatus.FORBIDDEN);
      }

      await this.knex.table('accounts').insert({
        userEmail: dto.userEmail,
      });

      return { message: 'account created' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * function to get a user's account details
   * @param email : string
   * @returns : user's account details
   */
  async getAccountDetails(email: string): Promise<Account[]> {
    try {
      return await this.knex.table('accounts').where('userEmail', email);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
