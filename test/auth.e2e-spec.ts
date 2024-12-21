import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { applyAppSettings } from '../src/settings/apply-app-settings';

const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(cookieParser());
    applyAppSettings(app);
    app.enableCors();
    await app.init();
    server = app.getHttpServer();

    await request(server)
      .delete('/testing/all-data')
      .set('Authorization', `Basic ${btoa('admin:qwerty')}`)
      .expect(204);
  });

  it('check login & refresh flow', async () => {
    const userDto = {
      login: 'login',
      email: 'test@gmail.com',
      password: '12345678',
    };
    const loginDto = {
      loginOrEmail: userDto.email,
      password: userDto.password,
    };
    const createUserResponce = await request(server)
      .post('/users')
      .set('Authorization', `Basic ${btoa('admin:qwerty')}`)
      .send(userDto);
    //.expect(201)
    const { password, ...expectedResult } = userDto;
    expect(createUserResponce.body).toMatchObject(expectedResult);

    const loginResponce = await request(server)
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    expect(loginResponce.body.accessToken).toEqual(expect.any(String));
    const refreshTokenUponLogin = loginResponce.headers['set-cookie'];
    await delay(20000);

    await request(server)
      .post('/auth/refresh-token')
      .set('Cookie', refreshTokenUponLogin)
      .expect(401);

    await request(server)
      .post('/auth/logout')
      .set('Cookie', refreshTokenUponLogin)
      .expect(401);

    const secondLoginResponce = await request(server)
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    expect(secondLoginResponce.body.accessToken).toEqual(expect.any(String));
    const secondRefreshTokenUponLogin =
      secondLoginResponce.headers['set-cookie'];
    console.log(secondRefreshTokenUponLogin, 'cookies');
    console.log(secondLoginResponce.body.accessToken, ' accessToken');

    const refreshResponce = await request(server)
      .post('/auth/refresh-token')
      .set('Cookie', secondRefreshTokenUponLogin)
      .expect(200);
  }, 30000);
});
