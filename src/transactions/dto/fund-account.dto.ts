import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class FundAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  accountEmail: string;
}
