import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

export function RegisterSwagger() {
   return applyDecorators(
      ApiOperation({ summary: 'Register a new user' }),
      ApiBody({ type: RegisterDto }),
      ApiResponse({
         status: 201,
         description: 'User successfully registered',
         schema: {
            example: {
               id: 'cmhyb5qrw0000t2g4t88y6zb2',
               username: 'johndoe',
               name: 'John Doe',
               createdAt: '2025-11-14T03:38:23.564Z',
               updatedAt: '2025-11-14T03:38:23.564Z',
            },
         },
      }),
      ApiResponse({
         status: 409,
         description: 'Username already exists',
         schema: {
            example: {
               statusCode: 409,
               message: 'Username sudah terdaftar',
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
               message: ['username should not be empty', 'Password minimal harus 8 karakter'],
               error: 'Bad Request',
            },
         },
      }),
   );
}

export function LoginSwagger() {
   return applyDecorators(
      ApiOperation({ summary: 'Login with username and password' }),
      ApiBody({ type: LoginDto }),
      ApiResponse({
         status: 200,
         description: 'Login successful',
         schema: {
            example: {
               access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
               user: {
                  username: 'johndoe',
                  name: 'John Doe',
               },
            },
         },
      }),
      ApiResponse({
         status: 401,
         description: 'Invalid credentials',
         schema: {
            example: {
               statusCode: 401,
               message: 'Username atau password salah',
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
               message: ['username should not be empty', 'password must be longer than or equal to 8 characters'],
               error: 'Bad Request',
            },
         },
      }),
   );
}

export function LogoutSwagger() {
   return applyDecorators(
      ApiBearerAuth('bearer'),
      ApiOperation({ summary: 'Logout (invalidate token on client side)' }),
      ApiResponse({
         status: 200,
         description: 'Logout successful',
         schema: {
            example: {
               message: 'Logout berhasil. Pastikan token dihapus di sisi klien.',
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
