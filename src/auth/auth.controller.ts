import { Controller, Post } from '@nestjs/common';
import { Body, HttpCode, Patch, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenInterface } from 'src/interfaces/access-token.interface';
import { SuccessMessage } from 'src/interfaces/success-message.interface';
import { UserInterface } from 'src/interfaces/user.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PasswordChangeDto } from './dto/password-change.dto';
import { RegisterUserDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() dto: RegisterUserDto): Promise<UserInterface> {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto): Promise<AccessTokenInterface> {
    return this.authService.login(dto);
  }

  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  changePassword(@Body() dto: PasswordChangeDto): Promise<SuccessMessage> {
    return this.authService.changePassword(dto);
  }
}
