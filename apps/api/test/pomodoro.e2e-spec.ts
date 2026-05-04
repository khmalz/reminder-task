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

type TaskResponse = {
   id: string;
};

type PomodoroTask = {
   id: string;
   title: string;
};

type PomodoroLogResponse = {
   id: string;
   durationMinutes: number;
   task: PomodoroTask | null;
   taskId: string | null;
};

describe('Pomodoro (e2e)', () => {
   let app: INestApplication<App>;
   let prisma: PrismaService;
   let authToken = '';
   let userId = '';
   let taskId = '';

   let categoryKindId = '';
   let categoryTypeId = '';
   let categoryCollectId = '';

   let generalLogId = '';
   let taskLogId = '';

   const testUser = {
      username: `user_${Date.now()}_pomodoro`,
      password: 'password123',
      name: 'User Pomodoro',
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

      const taskResponse = await request(app.getHttpServer())
         .post('/tasks')
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            title: 'Task untuk Pomodoro',
            isCompleted: false,
            categoryIds: [categoryKindId, categoryTypeId, categoryCollectId],
         })
         .expect(201);

      const taskBody = taskResponse.body as TaskResponse;
      taskId = taskBody.id;
   });

   afterAll(async () => {
      await prisma.user.deleteMany({
         where: { id: userId },
      });

      await app.close();
   });

   it('POST /pomodoro (general)', async () => {
      const response = await request(app.getHttpServer())
         .post('/pomodoro')
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            durationMinutes: 25,
            startedAt: '2026-05-04T08:30:00.000Z',
            endedAt: '2026-05-04T08:55:00.000Z',
         })
         .expect(201);

      const body = response.body as PomodoroLogResponse;
      generalLogId = body.id;

      expect(body.durationMinutes).toBe(25);
      expect(body.task).toBeNull();
   });

   it('POST /pomodoro (task linked)', async () => {
      const response = await request(app.getHttpServer())
         .post('/pomodoro')
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            durationMinutes: 50,
            startedAt: '2026-05-04T09:00:00.000Z',
            endedAt: '2026-05-04T09:50:00.000Z',
            taskId,
         })
         .expect(201);

      const body = response.body as PomodoroLogResponse;
      taskLogId = body.id;

      expect(body.durationMinutes).toBe(50);
      expect(body.task).toMatchObject({
         id: taskId,
         title: 'Task untuk Pomodoro',
      });
   });

   it('GET /pomodoro', async () => {
      const response = await request(app.getHttpServer()).get('/pomodoro').set('Authorization', `Bearer ${authToken}`).expect(200);
      const body = response.body as PomodoroLogResponse[];

      expect(Array.isArray(body)).toBe(true);
      const ids = body.map(log => log.id);
      expect(ids).toEqual(expect.arrayContaining([generalLogId, taskLogId]));
   });

   it('GET /pomodoro?taskId=...', async () => {
      const response = await request(app.getHttpServer()).get(`/pomodoro?taskId=${taskId}`).set('Authorization', `Bearer ${authToken}`).expect(200);
      const body = response.body as PomodoroLogResponse[];

      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
      expect(body.every(log => log.taskId === taskId)).toBe(true);
   });
});
