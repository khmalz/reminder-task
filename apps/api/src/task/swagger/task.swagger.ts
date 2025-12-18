import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

export function CreateTaskSwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Create a new task' }),
      ApiBody({ type: CreateTaskDto }),
      ApiResponse({
         status: 201,
         description: 'Task successfully created',
         schema: {
            example: {
               id: 'cmhylu9em0007t2xoz82fx2ms',
               title: 'Selesaikan coding task routes (v2 - Many-to-Many)',
               isCompleted: false,
               userId: 'cmhyb5qrw0000t2g4t88y6zb2',
               createdAt: '2025-11-14T08:37:23.614Z',
               updatedAt: '2025-11-14T08:37:23.614Z',
               categoryToTasks: [
                  {
                     category: {
                        id: 'cmhylq1u40003t2xovuw9oun1',
                        title: 'Zoom Link',
                        typeName: 'TASK_COLLECTION',
                     },
                  },
                  {
                     category: {
                        id: 'cmhylpk2y0001t2xotqf0xc7a',
                        title: 'Solo Work',
                        typeName: 'TASK_TYPE',
                     },
                  },
               ],
            },
         },
      }),
      ApiResponse({
         status: 400,
         description: 'Bad Request - Validation failed',
         schema: {
            example: {
               statusCode: 400,
               message: ['title should not be empty', 'categoryIds must be an array'],
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
   );
}

export function FindAllTasksSwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Get all tasks for the authenticated user' }),
      ApiResponse({
         status: 200,
         description: 'List of tasks retrieved successfully',
         schema: {
            example: [
               {
                  id: 'cmhylu9em0007t2xoz82fx2ms',
                  title: 'Selesaikan coding task routes (v2 - Many-to-Many)',
                  isCompleted: false,
                  userId: 'cmhyb5qrw0000t2g4t88y6zb2',
                  createdAt: '2025-11-14T08:37:23.614Z',
                  updatedAt: '2025-11-14T08:37:23.614Z',
                  categoryToTasks: [
                     {
                        category: {
                           id: 'cmhylq1u40003t2xovuw9oun1',
                           title: 'Zoom Link',
                           typeName: 'TASK_COLLECTION',
                        },
                     },
                  ],
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
   );
}

export function FindOneTaskSwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Get a specific task by ID' }),
      ApiParam({
         name: 'id',
         description: 'Task ID',
         example: 'cmhylu9em0007t2xoz82fx2ms',
      }),
      ApiResponse({
         status: 200,
         description: 'Task retrieved successfully',
         schema: {
            example: {
               id: 'cmhylu9em0007t2xoz82fx2ms',
               title: 'Selesaikan coding task routes (v2 - Many-to-Many)',
               isCompleted: false,
               userId: 'cmhyb5qrw0000t2g4t88y6zb2',
               createdAt: '2025-11-14T08:37:23.614Z',
               updatedAt: '2025-11-14T08:37:23.614Z',
               categoryToTasks: [
                  {
                     category: {
                        id: 'cmhylq1u40003t2xovuw9oun1',
                        title: 'Zoom Link',
                        typeName: 'TASK_COLLECTION',
                     },
                  },
               ],
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
   );
}

export function UpdateTaskSwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Update a task' }),
      ApiParam({
         name: 'id',
         description: 'Task ID',
         example: 'cmhylu9em0007t2xoz82fx2ms',
      }),
      ApiBody({ type: UpdateTaskDto }),
      ApiResponse({
         status: 200,
         description: 'Task updated successfully',
         schema: {
            example: {
               id: 'cmhylu9em0007t2xoz82fx2ms',
               title: 'Task routes v2 (DI-UPDATE)',
               isCompleted: true,
               userId: 'cmhyb5qrw0000t2g4t88y6zb2',
               createdAt: '2025-11-14T08:37:23.614Z',
               updatedAt: '2025-11-14T08:38:04.733Z',
               categoryToTasks: [
                  {
                     category: {
                        id: 'cmhylq1u40003t2xovuw9oun1',
                        title: 'Zoom Link',
                        typeName: 'TASK_COLLECTION',
                     },
                  },
               ],
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
      ApiResponse({
         status: 400,
         description: 'Bad Request - Validation failed',
         schema: {
            example: {
               statusCode: 400,
               message: ['title should not be empty'],
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
   );
}

export function DeleteTaskSwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Delete a task' }),
      ApiParam({
         name: 'id',
         description: 'Task ID',
         example: 'cmhylu9em0007t2xoz82fx2ms',
      }),
      ApiResponse({
         status: 200,
         description: 'Task deleted successfully',
         schema: {
            example: {
               message: 'Tugas berhasil dihapus',
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
   );
}

export function ToggleCompletedSwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Toggle task completion status' }),
      ApiParam({
         name: 'id',
         description: 'Task ID',
         example: 'cmhylu9em0007t2xoz82fx2ms',
      }),
      ApiResponse({
         status: 200,
         description: 'Task completion status toggled successfully',
         schema: {
            example: {
               id: 'cmhylu9em0007t2xoz82fx2ms',
               isCompleted: true,
               message: 'Tugas ditandai selesai',
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
   );
}
