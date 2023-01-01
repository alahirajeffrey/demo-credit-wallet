import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class PasswordChangeDto {
  @IsNotEmpty()
  @ApiProperty()
  oldPassword: string;

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(8, { message: 'password cannot be less than 8 letters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must contain the following: a capital letter, a number and a special character',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}
