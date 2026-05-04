import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

type LoginResponse = {
   access_token: string;
};

type CategoryResponse = {
   id: string;
   title: string;
   typeId: number;
};

type MessageResponse = {
   message: string;
};

describe('Category (e2e)', () => {
   let app: INestApplication<App>;
   let prisma: PrismaService;
   let authToken = '';
   let customCategoryId = '';

   const testUser = {
      username: `user_${Date.now()}_category`,
      password: 'password123',
      name: 'User Category',
   };

   beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      prisma = app.get(PrismaService);

      await request(app.getHttpServer()).post('/auth/register').send(testUser).expect(201);

      const loginResponse = await request(app.getHttpServer())
         .post('/auth/login')
         .send({
            username: testUser.username,
            password: testUser.password,
         })
         .expect(200);

      const loginBody = loginResponse.body as LoginResponse;
      authToken = loginBody.access_token;
   });

   afterAll(async () => {
      await prisma.user.deleteMany({
         where: { username: testUser.username },
      });

      await app.close();
   });

   it('GET /category?type=TASK_KIND', async () => {
      const response = await request(app.getHttpServer()).get('/category?type=TASK_KIND').set('Authorization', `Bearer ${authToken}`).expect(200);
      const body = response.body as CategoryResponse[];

      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
   });

   it('POST /category', async () => {
      const response = await request(app.getHttpServer())
         .post('/category')
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            title: 'Solo Work',
            categoryTypeName: 'TASK_TYPE',
         })
         .expect(201);

      const body = response.body as CategoryResponse;

      customCategoryId = body.id;
      expect(body.title).toBe('Solo Work');
      expect(body).toHaveProperty('typeId');
   });

   it('PUT /category/:id', async () => {
      const response = await request(app.getHttpServer())
         .put(`/category/${customCategoryId}`)
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            title: 'Independent Project (Diupdate)',
         })
         .expect(200);

      const body = response.body as CategoryResponse;
      expect(body.title).toBe('Independent Project (Diupdate)');
   });

   it('DELETE /category/:id', async () => {
      const response = await request(app.getHttpServer()).delete(`/category/${customCategoryId}`).set('Authorization', `Bearer ${authToken}`).expect(200);
      const body = response.body as MessageResponse;

      expect(body).toMatchObject({
         message: 'Category berhasil dihapus.',
      });
   });

   it('GET /category?type=SALAH_KETIK returns 400', async () => {
      await request(app.getHttpServer()).get('/category?type=SALAH_KETIK').set('Authorization', `Bearer ${authToken}`).expect(400);
   });
});
