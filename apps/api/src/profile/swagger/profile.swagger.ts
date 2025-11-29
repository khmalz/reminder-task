import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

export function UpdateProfileSwagger() {
   return applyDecorators(
      ApiOperation({ summary: 'Update user profile (username and name)' }),
      ApiBody({ type: UpdateProfileDto }),
      ApiResponse({
         status: 200,
         description: 'Profile updated successfully',
         schema: {
            example: {
               id: 'cmhyb5qrw0000t2g4t88y6zb2',
               username: 'johndoe_updated',
               name: 'John Doe Updated',
               createdAt: '2025-11-14T03:38:23.564Z',
               updatedAt: '2025-11-14T09:00:00.000Z',
            },
         },
      }),
      ApiResponse({
         status: 404,
         description: 'User not found',
         schema: {
            example: {
               statusCode: 404,
               message: 'User tidak ditemukan',
               error: 'Not Found',
            },
         },
      }),
      ApiResponse({
         status: 409,
         description: 'Username already taken',
         schema: {
            example: {
               statusCode: 409,
               message: 'Username sudah digunakan oleh user lain',
               error: 'Conflict',
            },
         },
      }),
      ApiResponse({
         status: 400,
         description: 'Bad Request - Validation failed',
         schema: {
            example: {
               statusCode: 400,
               message: ['username should not be empty', 'name should not be empty'],
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

export function UpdatePasswordSwagger() {
   return applyDecorators(
      ApiOperation({ summary: 'Update user password' }),
      ApiBody({ type: UpdatePasswordDto }),
      ApiResponse({
         status: 200,
         description: 'Password updated successfully',
         schema: {
            example: {
               message: 'Password berhasil diupdate',
            },
         },
      }),
      ApiResponse({
         status: 404,
         description: 'User not found',
         schema: {
            example: {
               statusCode: 404,
               message: 'User tidak ditemukan',
               error: 'Not Found',
            },
         },
      }),
      ApiResponse({
         status: 401,
         description: 'Unauthorized - Old password is incorrect or invalid token',
         schema: {
            example: {
               statusCode: 401,
               message: 'Password lama tidak sesuai',
               error: 'Unauthorized',
            },
         },
      }),
      ApiResponse({
         status: 400,
         description: 'Bad Request - Validation failed',
         schema: {
            example: {
               statusCode: 400,
               message: ['oldPassword should not be empty', 'Password minimal harus 8 karakter'],
               error: 'Bad Request',
            },
         },
      }),
   );
}
