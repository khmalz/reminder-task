import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

type RegisterResponse = {
   id: string;
   username: string;
   name: string;
};

type LoginResponse = {
   access_token: string;
   user: {
      username: string;
      name: string;
   };
};

type LogoutResponse = {
   message: string;
};

describe('Auth (e2e)', () => {
   let app: INestApplication<App>;
   let prisma: PrismaService;

   const registerUser = {
      username: `user_${Date.now()}_register`,
      password: 'password123',
      name: 'User Register',
   };

   const loginUser = {
      username: `user_${Date.now()}_login`,
      password: 'password123',
      name: 'User Login',
   };

   beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      prisma = app.get(PrismaService);

      await request(app.getHttpServer()).post('/auth/register').send(loginUser).expect(201);
   });

   afterAll(async () => {
      await prisma.user.deleteMany({
         where: {
            username: {
               in: [registerUser.username, loginUser.username],
            },
         },
      });

      await app.close();
   });

   it('POST /auth/register', async () => {
      const response = await request(app.getHttpServer()).post('/auth/register').send(registerUser).expect(201);
      const body = response.body as RegisterResponse;

      expect(body).toHaveProperty('id');
      expect(body.username).toBe(registerUser.username);
      expect(body.name).toBe(registerUser.name);
   });

   it('POST /auth/login', async () => {
      const response = await request(app.getHttpServer())
         .post('/auth/login')
         .send({
            username: loginUser.username,
            password: loginUser.password,
         })
         .expect(200);

      const body = response.body as LoginResponse;

      expect(body).toHaveProperty('access_token');
      expect(body.user).toMatchObject({
         username: loginUser.username,
         name: loginUser.name,
      });
   });

   it('POST /auth/logout', async () => {
      const loginResponse = await request(app.getHttpServer())
         .post('/auth/login')
         .send({
            username: loginUser.username,
            password: loginUser.password,
         })
         .expect(200);

      const loginBody = loginResponse.body as LoginResponse;
      const token = loginBody.access_token;

      const response = await request(app.getHttpServer()).post('/auth/logout').set('Authorization', `Bearer ${token}`).expect(200);
      const body = response.body as LogoutResponse;

      expect(body).toMatchObject({
         message: 'Logout berhasil. Pastikan token dihapus di sisi klien.',
      });
   });
});
