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

type CategoryResponse = {
   id: string;
};

type TaskCategory = {
   category: {
      id: string;
      title: string;
      typeName: string;
   };
};

type TaskResponse = {
   id: string;
   title: string;
   isCompleted: boolean;
   categoryToTasks: TaskCategory[];
};

type MessageResponse = {
   message: string;
};

describe('Task (e2e)', () => {
   let app: INestApplication<App>;
   let prisma: PrismaService;
   let authToken = '';
   let userId = '';
   let taskId = '';

   let categoryKindId = '';
   let categoryTypeId = '';
   let categoryCollectId = '';
   let categoryUpdateId = '';

   const testUser = {
      username: `user_${Date.now()}_task`,
      password: 'password123',
      name: 'User Task',
   };

   beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      prisma = app.get(PrismaService);

      const registerResponse = await request(app.getHttpServer()).post('/auth/register').send(testUser).expect(201);
      const registerBody = registerResponse.body as RegisterResponse;
      userId = registerBody.id;

      const loginResponse = await request(app.getHttpServer())
         .post('/auth/login')
         .send({
            username: testUser.username,
            password: testUser.password,
         })
         .expect(200);

      const loginBody = loginResponse.body as LoginResponse;
      authToken = loginBody.access_token;

      const kindResponse = await request(app.getHttpServer()).get('/category?type=TASK_KIND').set('Authorization', `Bearer ${authToken}`).expect(200);
      const kindBody = kindResponse.body as CategoryResponse[];

      const typeResponse = await request(app.getHttpServer()).get('/category?type=TASK_TYPE').set('Authorization', `Bearer ${authToken}`).expect(200);
      const typeBody = typeResponse.body as CategoryResponse[];

      const collectResponse = await request(app.getHttpServer()).get('/category?type=TASK_COLLECTION').set('Authorization', `Bearer ${authToken}`).expect(200);
      const collectBody = collectResponse.body as CategoryResponse[];

      categoryKindId = kindBody[0]?.id ?? '';
      categoryTypeId = typeBody[0]?.id ?? '';
      categoryCollectId = collectBody[0]?.id ?? '';

      expect(categoryKindId).not.toBe('');
      expect(categoryTypeId).not.toBe('');
      expect(categoryCollectId).not.toBe('');

      const createCategoryResponse = await request(app.getHttpServer())
         .post('/category')
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            title: 'Update Type',
            categoryTypeName: 'TASK_TYPE',
         })
         .expect(201);

      const createdCategoryBody = createCategoryResponse.body as CategoryResponse;
      categoryUpdateId = createdCategoryBody.id;
   });

   afterAll(async () => {
      await prisma.user.deleteMany({
         where: { id: userId },
      });

      await app.close();
   });

   it('POST /tasks', async () => {
      const response = await request(app.getHttpServer())
         .post('/tasks')
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            title: 'Selesaikan makalah',
            isCompleted: false,
            categoryIds: [categoryKindId, categoryTypeId, categoryCollectId],
         })
         .expect(201);

      const body = response.body as TaskResponse;
      taskId = body.id;

      expect(body.title).toBe('Selesaikan makalah');
      expect(body.isCompleted).toBe(false);
      expect(body.categoryToTasks).toHaveLength(3);
      expect(body.categoryToTasks[0]?.category).toHaveProperty('typeName');
   });

   it('GET /tasks', async () => {
      const response = await request(app.getHttpServer()).get('/tasks').set('Authorization', `Bearer ${authToken}`).expect(200);
      const body = response.body as TaskResponse[];

      expect(Array.isArray(body)).toBe(true);
      expect(body.some(task => task.id === taskId)).toBe(true);
   });

   it('GET /tasks/:id', async () => {
      const response = await request(app.getHttpServer()).get(`/tasks/${taskId}`).set('Authorization', `Bearer ${authToken}`).expect(200);
      const body = response.body as TaskResponse;

      expect(body.id).toBe(taskId);
      expect(body.categoryToTasks.length).toBeGreaterThan(0);
   });

   it('PATCH /tasks/:id', async () => {
      const response = await request(app.getHttpServer())
         .patch(`/tasks/${taskId}`)
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            title: 'Task routes v2 (DI-UPDATE)',
            isCompleted: true,
            categoryIds: [categoryKindId, categoryUpdateId, categoryCollectId],
         })
         .expect(200);

      const body = response.body as TaskResponse;

      expect(body.title).toBe('Task routes v2 (DI-UPDATE)');
      expect(body.isCompleted).toBe(true);
      expect(body.categoryToTasks).toHaveLength(3);
   });

   it('DELETE /tasks/:id', async () => {
      const response = await request(app.getHttpServer()).delete(`/tasks/${taskId}`).set('Authorization', `Bearer ${authToken}`).expect(200);
      const body = response.body as MessageResponse;

      expect(body).toMatchObject({
         message: 'Tugas berhasil dihapus',
      });
   });
});
