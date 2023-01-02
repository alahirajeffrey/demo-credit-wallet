import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { LoginDto } from './dto/login.dto';
import { PasswordChangeDto } from './dto/password-change.dto';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserInterface } from 'src/interfaces/user.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenInterface } from 'src/interfaces/access-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  // function to create access tokens when user logs in
  async signToken(
    userId: string,
    email: string,
  ): Promise<AccessTokenInterface> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('EXPIRES_IN'),
      secret: this.config.get('JWT_SECRET'),
    });

    return { accessToken: token };
  }

  async checkUserExists(email: string) {
    // check if user with email already exists
    try {
      return await this.knex.table('users').where('email', email);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async registerUser(dto: RegisterUserDto): Promise<UserInterface> {
    try {
      // check if user with email already exists
      const userExists = await this.checkUserExists(dto.email);

      if (userExists.length > 0) {
        throw new HttpException('user already exists', HttpStatus.FORBIDDEN);
      }

      //hash user password
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      //save user to db
      await this.knex.table('users').insert({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      });

      return { name: dto.name, email: dto.email };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(dto: LoginDto): Promise<AccessTokenInterface> {
    try {
      // check if user with email already exists
      const userExists = await this.checkUserExists(dto.email);
      if (userExists.length == 0) {
        throw new HttpException('user does not exist', HttpStatus.FORBIDDEN);
      }

      //compare passwords
      const passwordMatches = await bcrypt.compare(
        dto.password,
        userExists[0].password,
      );
      if (!passwordMatches) {
        throw new HttpException('incorrect password', HttpStatus.FORBIDDEN);
      }

      //return token
      return await this.signToken(userExists[0].id, userExists[0].email);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changePassword(dto: PasswordChangeDto): Promise<Object> {
    try {
      // get user details
      const userExists = await this.checkUserExists(dto.email);

      //compare passwords
      const passwordMatches = await bcrypt.compare(
        dto.oldPassword,
        userExists[0].password,
      );
      if (!passwordMatches) {
        throw new HttpException('incorrect password', HttpStatus.FORBIDDEN);
      }

      //update password
      const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);
      await this.knex.table('users').update('password', newPasswordHash);

      return { message: 'password changed' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
