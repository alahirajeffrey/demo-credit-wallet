import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AppModule } from '../app.module';

describe('Auth Routes', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Register User', () => {
    const newUser = {
      email: 'jeffreyalahira@gmail.com',
      password: 'P@ssword',
      name: 'alahira jeffrey',
    };

    it('should create a new user and return a 201 response', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(newUser)
        .expect(201)
        .expect({
          name: 'alahira jeffrey',
          email: 'jeffreyalahira@gmail.com',
        });
    });

    it('should return a 500 error if user already exists', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(newUser)
        .expect(500);
    });

    it('should return a 500 error', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(500);
    });
  });

  describe('Login', () => {
    const userWithCorrectPassword = {
      email: 'jeffreyalahira@gmail.com',
      password: 'P@ssword',
    };

    const userWithIncorrectPassword = {
      email: 'jeffreyalahira@gmail.com',
      password: 'Password',
    };

    it('should return a 201 code and a json response', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(userWithCorrectPassword)
        .expect('Content-Type', /json/)
        .expect(201);
    });

    it('should return a 500 response password is wrong', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(userWithIncorrectPassword)
        .expect(500);
    });

    it('should return a 500 response if request appropraite request data is not passed', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(500);
    });
  });
});
