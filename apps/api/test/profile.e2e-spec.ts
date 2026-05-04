import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

type RegisterResponse = {
   id: string;
};

type LoginResponse = {
   access_token: string;
};

type ProfileResponse = {
   id: string;
   username: string;
   name: string;
};

type MessageResponse = {
   message: string;
};

describe('Profile (e2e)', () => {
   let app: INestApplication<App>;
   let prisma: PrismaService;
   let authToken = '';
   let userId = '';

   let currentUsername = '';
   let currentName = '';
   let currentPassword = '';

   beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      prisma = app.get(PrismaService);

      const registerUser = {
         username: `user_${Date.now()}_profile`,
         password: 'password123',
         name: 'User Profile',
      };

      const registerResponse = await request(app.getHttpServer()).post('/auth/register').send(registerUser).expect(201);
      const registerBody = registerResponse.body as RegisterResponse;

      userId = registerBody.id;
      currentUsername = registerUser.username;
      currentName = registerUser.name;
      currentPassword = registerUser.password;

      const loginResponse = await request(app.getHttpServer())
         .post('/auth/login')
         .send({
            username: currentUsername,
            password: currentPassword,
         })
         .expect(200);

      const loginBody = loginResponse.body as LoginResponse;
      authToken = loginBody.access_token;
   });

   afterAll(async () => {
      await prisma.user.deleteMany({
         where: { id: userId },
      });

      await app.close();
   });

   it('PATCH /profile', async () => {
      const response = await request(app.getHttpServer())
         .patch('/profile')
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            username: `user_${Date.now()}_profile_updated`,
            name: 'User Profile Updated',
         })
         .expect(200);

      const body = response.body as ProfileResponse;

      currentUsername = body.username;
      currentName = body.name;

      expect(body.id).toBe(userId);
      expect(body.username).toBe(currentUsername);
      expect(body.name).toBe(currentName);
   });

   it('PATCH /profile/password', async () => {
      const newPassword = 'newpassword123';

      const response = await request(app.getHttpServer())
         .patch('/profile/password')
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            oldPassword: currentPassword,
            newPassword,
         })
         .expect(200);

      const body = response.body as MessageResponse;

      expect(body).toMatchObject({
         message: 'Password berhasil diupdate',
      });

      currentPassword = newPassword;

      await request(app.getHttpServer())
         .post('/auth/login')
         .send({
            username: currentUsername,
            password: currentPassword,
         })
         .expect(200);
   });

   it('PATCH /profile/password with wrong old password returns 401', async () => {
      await request(app.getHttpServer())
         .patch('/profile/password')
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            oldPassword: 'wrongpass',
            newPassword: 'shouldnotwork123',
         })
         .expect(401);
   });

   it('PATCH /profile with empty fields returns 400', async () => {
      await request(app.getHttpServer())
         .patch('/profile')
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            username: '',
            name: '',
         })
         .expect(400);
   });

   it('PATCH /profile without token returns 401', async () => {
      await request(app.getHttpServer())
         .patch('/profile')
         .send({
            username: 'should_fail',
            name: 'Should Fail',
         })
         .expect(401);
   });
});
