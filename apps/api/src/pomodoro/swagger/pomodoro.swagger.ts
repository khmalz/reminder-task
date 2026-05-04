import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreatePomodoroLogDto } from '../dto/create-pomodoro-log.dto';

export function CreatePomodoroLogSwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Create a new pomodoro log' }),
      ApiBody({ type: CreatePomodoroLogDto }),
      ApiResponse({
         status: 201,
         description: 'Pomodoro log created successfully',
         schema: {
            example: {
               id: 'cmn0s9x5j0003t2l8n7h1t9z2',
               durationMinutes: 25,
               startedAt: '2026-05-04T08:30:00.000Z',
               endedAt: '2026-05-04T08:55:00.000Z',
               userId: 'cmhyb5qrw0000t2g4t88y6zb2',
               taskId: 'cmhylu9em0007t2xoz82fx2ms',
               createdAt: '2026-05-04T08:55:00.000Z',
               updatedAt: '2026-05-04T08:55:00.000Z',
               task: {
                  id: 'cmhylu9em0007t2xoz82fx2ms',
                  title: 'Selesaikan makalah',
               },
            },
         },
      }),
      ApiResponse({
         status: 400,
         description: 'Bad Request - Validation failed',
         schema: {
            example: {
               statusCode: 400,
               message: ['durationMinutes must not be less than 1'],
               error: 'Bad Request',
            },
         },
      }),
      ApiResponse({
         status: 401,
         description: 'Unauthorized - Invalid or missing token',
         schema: {
            example: {
               statusCode: 401,
               message: 'Unauthorized',
            },
         },
      }),
      ApiResponse({
         status: 404,
         description: 'Task not found',
         schema: {
            example: {
               statusCode: 404,
               message: 'Tugas tidak ditemukan.',
               error: 'Not Found',
            },
         },
      }),
   );
}

export function FindAllPomodoroLogsSwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Get all pomodoro logs for the authenticated user' }),
      ApiQuery({
         name: 'taskId',
         required: false,
         description: 'Filter logs by task ID',
         example: 'cmhylu9em0007t2xoz82fx2ms',
      }),
      ApiResponse({
         status: 200,
         description: 'List of pomodoro logs retrieved successfully',
         schema: {
            example: [
               {
                  id: 'cmn0s9x5j0003t2l8n7h1t9z2',
                  durationMinutes: 25,
                  startedAt: '2026-05-04T08:30:00.000Z',
                  endedAt: '2026-05-04T08:55:00.000Z',
                  userId: 'cmhyb5qrw0000t2g4t88y6zb2',
                  taskId: null,
                  createdAt: '2026-05-04T08:55:00.000Z',
                  updatedAt: '2026-05-04T08:55:00.000Z',
                  task: null,
               },
            ],
         },
      }),
      ApiResponse({
         status: 401,
         description: 'Unauthorized - Invalid or missing token',
         schema: {
            example: {
               statusCode: 401,
               message: 'Unauthorized',
            },
         },
      }),
      ApiResponse({
         status: 404,
         description: 'Task not found',
         schema: {
            example: {
               statusCode: 404,
               message: 'Tugas tidak ditemukan.',
               error: 'Not Found',
            },
         },
      }),
   );
}
