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
import { SuccessMessage } from 'src/interfaces/success-message.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * function to generate acess token for a user
   * @param userId : number
   * @param email : string
   * @returns : an access token
   */
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

  /**
   * function to check if a user exists
   * @param email : string
   * @returns a user if it exists or an empty array
   */
  async checkUserExists(email: string) {
    // check if user with email already exists
    try {
      return await this.knex.table('users').where('email', email);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * function to register a user
   * @param dto : register user dto
   * @returns a user's details
   */
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

  /**
   * function to login a user
   * @param dto : login user dto
   * @returns an access token
   */
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

  /**
   * function to change a user's password
   * @param dto : change password dto
   * @returns : a success message
   */
  async changePassword(dto: PasswordChangeDto): Promise<SuccessMessage> {
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
