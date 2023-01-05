import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Account } from 'src/interfaces/account.interface';
import { SuccessMessage } from 'src/interfaces/success-message.interface';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create-account')
  createAccount(@Body() dto: CreateAccountDto): Promise<SuccessMessage> {
    return this.accountService.createAccount(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('account-details/:email')
  getAccountDetails(@Param('email') email: string): Promise<Account[]> {
    return this.accountService.getAccountDetails(email);
  }
}
