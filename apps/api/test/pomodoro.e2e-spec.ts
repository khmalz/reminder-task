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

   it('STP-DB-01: Pengujian Cascade Delete', async () => {
      const tempUser = {
         username: `temp_${Date.now()}_cascade`,
         password: 'password123',
         name: 'Temp User Cascade',
      };
      const registerRes = await request(app.getHttpServer()).post('/auth/register').send(tempUser).expect(201);
      const tempUserId = (registerRes.body as RegisterResponse).id;

      const loginRes = await request(app.getHttpServer())
         .post('/auth/login')
         .send({
            username: tempUser.username,
            password: tempUser.password,
         })
         .expect(200);
      const tempToken = (loginRes.body as LoginResponse).access_token;

      await request(app.getHttpServer())
         .post('/pomodoro')
         .set('Authorization', `Bearer ${tempToken}`)
         .send({
            durationMinutes: 25,
            startedAt: new Date().toISOString(),
            endedAt: new Date().toISOString(),
         })
         .expect(201);

      const beforeCount = await prisma.pomodoroLog.count({
         where: { userId: tempUserId },
      });
      expect(beforeCount).toBe(1);

      await prisma.user.delete({
         where: { id: tempUserId },
      });

      const afterCount = await prisma.pomodoroLog.count({
         where: { userId: tempUserId },
      });
      expect(afterCount).toBe(0);
   });

   it('STP-DB-02: Pengujian SetNull', async () => {
      const taskRes = await request(app.getHttpServer())
         .post('/tasks')
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            title: 'Temp Task SetNull',
            isCompleted: false,
            categoryIds: [categoryKindId, categoryTypeId, categoryCollectId],
         })
         .expect(201);
      const tempTaskId = (taskRes.body as TaskResponse).id;

      const pomodoroRes = await request(app.getHttpServer())
         .post('/pomodoro')
         .set('Authorization', `Bearer ${authToken}`)
         .send({
            durationMinutes: 25,
            startedAt: new Date().toISOString(),
            endedAt: new Date().toISOString(),
            taskId: tempTaskId,
         })
         .expect(201);
      const tempLogId = (pomodoroRes.body as PomodoroLogResponse).id;

      const logBefore = await prisma.pomodoroLog.findUnique({
         where: { id: tempLogId },
      });
      expect(logBefore?.taskId).toBe(tempTaskId);

      await prisma.task.delete({
         where: { id: tempTaskId },
      });

      const logAfter = await prisma.pomodoroLog.findUnique({
         where: { id: tempLogId },
      });
      expect(logAfter).not.toBeNull();
      expect(logAfter?.taskId).toBeNull();
   });

   it('STP-DB-03: Validasi Integritas FK', async () => {
      await expect(
         prisma.pomodoroLog.create({
            data: {
               durationMinutes: 25,
               startedAt: new Date(),
               endedAt: new Date(),
               userId: 'non-existent-user-id',
            },
         }),
      ).rejects.toThrow();
   });

   it('STP-DB-04: Efisiensi Akses Data', async () => {
      const start = performance.now();

      await prisma.pomodoroLog.findMany({
         where: {
            userId,
            taskId,
         },
      });

      const end = performance.now();
      const duration = end - start;

      expect(duration).toBeLessThan(50);
   });
});
