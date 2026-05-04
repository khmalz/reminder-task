import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

type HealthResponse = {
   status: string;
   message: string;
   timestamp: string;
};

describe('AppController (e2e)', () => {
   let app: INestApplication<App>;

   beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
   });

   afterAll(async () => {
      await app.close();
   });

   it('/ (GET)', async () => {
      const response = await request(app.getHttpServer()).get('/').expect(200);
      const body = response.body as HealthResponse;

      expect(body).toMatchObject({
         status: 'ok',
         message: 'API is healthy',
      });
      expect(new Date(body.timestamp).toString()).not.toBe('Invalid Date');
   });
});
