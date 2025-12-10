import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

export function CreateCategorySwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Create a new custom category' }),
      ApiBody({ type: CreateCategoryDto }),
      ApiResponse({
         status: 201,
         description: 'Category successfully created',
         schema: {
            example: {
               id: 'cmhylpk2y0001t2xotqf0xc7a',
               title: 'Solo Work',
               typeId: 2,
               userId: 'cmhyb5qrw0000t2g4t88y6zb2',
               createdAt: '2025-11-14T08:33:44.167Z',
               updatedAt: '2025-11-14T08:33:44.167Z',
            },
         },
      }),
      ApiResponse({
         status: 400,
         description: 'Bad Request - Validation failed',
         schema: {
            example: {
               statusCode: 400,
               message: ['title should not be empty', 'categoryTypeName must be one of the following values: TASK_KIND, TASK_TYPE, TASK_COLLECTION'],
               error: 'Bad Request',
            },
         },
      }),
      ApiResponse({
         status: 404,
         description: 'Category type not found (not seeded)',
         schema: {
            example: {
               statusCode: 404,
               message: 'CategoryType: TASK_TYPE belum di-seed.',
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

export function FindAllCategoriesSwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Get all categories by type' }),
      ApiQuery({
         name: 'type',
         description: 'Category type to filter',
         example: 'TASK_TYPE',
         enum: ['TASK_KIND', 'TASK_TYPE', 'TASK_COLLECTION'],
      }),
      ApiResponse({
         status: 200,
         description: 'List of categories retrieved successfully',
         schema: {
            example: [
               {
                  id: 'cmhylpk2y0001t2xotqf0xc7a',
                  title: 'Solo Work',
                  typeId: 2,
                  userId: 'cmhyb5qrw0000t2g4t88y6zb2',
                  createdAt: '2025-11-14T08:33:44.167Z',
                  updatedAt: '2025-11-14T08:33:44.167Z',
               },
               {
                  id: 'cmhylq1u40003t2xovuw9oun1',
                  title: 'Meeting',
                  typeId: 2,
                  userId: 'cmhyb5qrw0000t2g4t88y6zb2',
                  createdAt: '2025-11-14T08:34:07.180Z',
                  updatedAt: '2025-11-14T08:34:07.180Z',
               },
            ],
         },
      }),
      ApiResponse({
         status: 400,
         description: 'Bad Request - Invalid type parameter',
         schema: {
            example: {
               statusCode: 400,
               message: ['type must be one of the following values: TASK_KIND, TASK_TYPE, TASK_COLLECTION'],
               error: 'Bad Request',
            },
         },
      }),
      ApiResponse({
         status: 404,
         description: 'Category type not found (not seeded)',
         schema: {
            example: {
               statusCode: 404,
               message: 'CategoryType: TASK_TYPE belum di-seed.',
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

export function UpdateCategorySwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Update a custom category' }),
      ApiParam({
         name: 'id',
         description: 'Category ID',
         example: 'cmhylpk2y0001t2xotqf0xc7a',
      }),
      ApiBody({ type: UpdateCategoryDto }),
      ApiResponse({
         status: 200,
         description: 'Category updated successfully',
         schema: {
            example: {
               id: 'cmhylpk2y0001t2xotqf0xc7a',
               title: 'Solo Work (Updated)',
               typeId: 2,
               userId: 'cmhyb5qrw0000t2g4t88y6zb2',
               createdAt: '2025-11-14T08:33:44.167Z',
               updatedAt: '2025-11-14T08:40:00.000Z',
            },
         },
      }),
      ApiResponse({
         status: 404,
         description: 'Category not found',
         schema: {
            example: {
               statusCode: 404,
               message: 'Category tidak ditemukan.',
               error: 'Not Found',
            },
         },
      }),
      ApiResponse({
         status: 403,
         description: 'Forbidden - Cannot update category owned by another user or system category',
         schema: {
            example: {
               statusCode: 403,
               message: 'Anda hanya dapat mengubah Category custom milik Anda.',
               error: 'Forbidden',
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

export function DeleteCategorySwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Delete a custom category' }),
      ApiParam({
         name: 'id',
         description: 'Category ID',
         example: 'cmhylpk2y0001t2xotqf0xc7a',
      }),
      ApiResponse({
         status: 200,
         description: 'Category deleted successfully',
         schema: {
            example: {
               message: 'Category berhasil dihapus.',
            },
         },
      }),
      ApiResponse({
         status: 404,
         description: 'Category not found',
         schema: {
            example: {
               statusCode: 404,
               message: 'Category tidak ditemukan.',
               error: 'Not Found',
            },
         },
      }),
      ApiResponse({
         status: 403,
         description: 'Forbidden - Cannot delete category owned by another user or system category',
         schema: {
            example: {
               statusCode: 403,
               message: 'Anda hanya dapat mengubah Category custom milik Anda.',
               error: 'Forbidden',
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
