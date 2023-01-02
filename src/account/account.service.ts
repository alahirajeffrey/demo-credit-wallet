import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createAccount(dto: CreateAccountDto): Promise<Object> {
    try {
      //check to see if user already has an account
      const accountExists = await this.knex
        .table('accounts')
        .where('userEmail', dto.userEmail);
      if (accountExists) {
        throw new HttpException('account already exists', HttpStatus.FORBIDDEN);
      }

      await this.knex.table('accounts').insert({
        userEmail: dto.userEmail,
      });

      return { message: 'Wallet created' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAccountDetails(email: string) {
    try {
      return await this.knex.table('accounts').where('userEmail', email);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
