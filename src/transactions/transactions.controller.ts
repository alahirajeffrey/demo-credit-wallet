import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
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
  fundAccount(@Body() dto: FundAccountDto) {
    return this.transactionsService.fundAccount(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('transfer-fund')
  transferFunds(@Body() dto: TransferFundsDto) {
    return this.transactionsService.tranferFunds(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('withdraw-funds')
  withdrawFunds(@Body() dto: WithdrawFundsDto) {
    return this.transactionsService.withdrawFunds(dto);
  }
}
