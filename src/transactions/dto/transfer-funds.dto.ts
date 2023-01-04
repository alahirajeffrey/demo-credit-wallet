import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class TransferFundsDto {
  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  accountEmail: string;

  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  recieverEmail: string;
}
