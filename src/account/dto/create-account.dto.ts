import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  userEmail: string;
}
