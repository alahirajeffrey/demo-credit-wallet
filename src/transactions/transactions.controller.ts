import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Get, Param } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { SuccessMessage } from 'src/interfaces/success-message.interface';
import { FundAccountDto } from './dto/fund-account.dto';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { WithdrawFundsDto } from './dto/withdraw-funds.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('fund-account')
  fundAccount(@Body() dto: FundAccountDto): Promise<SuccessMessage> {
    return this.transactionsService.fundAccount(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('view-transactions/:email')
  getUserTransactions(@Param('email') email: string) {
    return this.transactionsService.getUserTransactions(email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('transfer-fund')
  transferFunds(@Body() dto: TransferFundsDto): Promise<SuccessMessage> {
    return this.transactionsService.tranferFunds(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('withdraw-funds')
  withdrawFunds(@Body() dto: WithdrawFundsDto): Promise<SuccessMessage> {
    return this.transactionsService.withdrawFunds(dto);
  }
}
