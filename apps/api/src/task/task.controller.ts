import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UsePipes(
   new ValidationPipe({
      whitelist: true,
      transform: true,
   }),
)
export class TaskController {
   constructor(private readonly taskService: TaskService) {}

   @Post()
   @ApiOperation({ summary: 'Create a new task' })
   @ApiBody({ type: CreateTaskDto })
   @ApiResponse({
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
                  categoryId: 'cmhylq1u40003t2xovuw9oun1',
                  taskId: 'cmhylu9em0007t2xoz82fx2ms',
                  category: {
                     id: 'cmhylq1u40003t2xovuw9oun1',
                     title: 'Zoom Link',
                     typeId: 3,
                  },
               },
               {
                  categoryId: 'cmhylpk2y0001t2xotqf0xc7a',
                  taskId: 'cmhylu9em0007t2xoz82fx2ms',
                  category: {
                     id: 'cmhylpk2y0001t2xotqf0xc7a',
                     title: 'Solo Work',
                     typeId: 2,
                  },
               },
            ],
         },
      },
   })
   @ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed',
      schema: {
         example: {
            statusCode: 400,
            message: ['title should not be empty', 'categoryIds must be an array'],
            error: 'Bad Request',
         },
      },
   })
   @ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
      schema: {
         example: {
            statusCode: 401,
            message: 'Unauthorized',
         },
      },
   })
   create(@Body() createTaskDto: CreateTaskDto, @GetUser('sub') userId: string) {
      return this.taskService.create(createTaskDto, userId);
   }

   @Get()
   @ApiOperation({ summary: 'Get all tasks for the authenticated user' })
   @ApiResponse({
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
                     categoryId: 'cmhylq1u40003t2xovuw9oun1',
                     taskId: 'cmhylu9em0007t2xoz82fx2ms',
                     category: {
                        id: 'cmhylq1u40003t2xovuw9oun1',
                        title: 'Zoom Link',
                        typeId: 3,
                     },
                  },
               ],
            },
         ],
      },
   })
   @ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
      schema: {
         example: {
            statusCode: 401,
            message: 'Unauthorized',
         },
      },
   })
   findAll(@GetUser('sub') userId: string) {
      return this.taskService.findAll(userId);
   }

   @Get(':id')
   @ApiOperation({ summary: 'Get a specific task by ID' })
   @ApiParam({
      name: 'id',
      description: 'Task ID',
      example: 'cmhylu9em0007t2xoz82fx2ms',
   })
   @ApiResponse({
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
                  categoryId: 'cmhylq1u40003t2xovuw9oun1',
                  taskId: 'cmhylu9em0007t2xoz82fx2ms',
                  category: {
                     id: 'cmhylq1u40003t2xovuw9oun1',
                     title: 'Zoom Link',
                     typeId: 3,
                  },
               },
            ],
         },
      },
   })
   @ApiResponse({
      status: 404,
      description: 'Task not found',
      schema: {
         example: {
            statusCode: 404,
            message: 'Tugas tidak ditemukan.',
            error: 'Not Found',
         },
      },
   })
   @ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
      schema: {
         example: {
            statusCode: 401,
            message: 'Unauthorized',
         },
      },
   })
   findOne(@Param('id') id: string, @GetUser('sub') userId: string) {
      return this.taskService.findOne(id, userId);
   }

   @Patch(':id')
   @ApiOperation({ summary: 'Update a task' })
   @ApiParam({
      name: 'id',
      description: 'Task ID',
      example: 'cmhylu9em0007t2xoz82fx2ms',
   })
   @ApiBody({ type: UpdateTaskDto })
   @ApiResponse({
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
                  categoryId: 'cmhylq1u40003t2xovuw9oun1',
                  taskId: 'cmhylu9em0007t2xoz82fx2ms',
                  category: {
                     id: 'cmhylq1u40003t2xovuw9oun1',
                     title: 'Zoom Link',
                     typeId: 3,
                  },
               },
            ],
         },
      },
   })
   @ApiResponse({
      status: 404,
      description: 'Task not found',
      schema: {
         example: {
            statusCode: 404,
            message: 'Tugas tidak ditemukan.',
            error: 'Not Found',
         },
      },
   })
   @ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed',
      schema: {
         example: {
            statusCode: 400,
            message: ['title should not be empty'],
            error: 'Bad Request',
         },
      },
   })
   @ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
      schema: {
         example: {
            statusCode: 401,
            message: 'Unauthorized',
         },
      },
   })
   update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @GetUser('sub') userId: string) {
      return this.taskService.update(id, userId, updateTaskDto);
   }

   @Delete(':id')
   @ApiOperation({ summary: 'Delete a task' })
   @ApiParam({
      name: 'id',
      description: 'Task ID',
      example: 'cmhylu9em0007t2xoz82fx2ms',
   })
   @ApiResponse({
      status: 200,
      description: 'Task deleted successfully',
      schema: {
         example: {
            message: 'Tugas berhasil dihapus',
         },
      },
   })
   @ApiResponse({
      status: 404,
      description: 'Task not found',
      schema: {
         example: {
            statusCode: 404,
            message: 'Tugas tidak ditemukan.',
            error: 'Not Found',
         },
      },
   })
   @ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
      schema: {
         example: {
            statusCode: 401,
            message: 'Unauthorized',
         },
      },
   })
   remove(@Param('id') id: string, @GetUser('sub') userId: string) {
      return this.taskService.remove(id, userId);
   }
}
