import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
   @ApiProperty({
      description: 'Username for the new account',
      example: 'johndoe',
      minLength: 3,
   })
   @IsString()
   @IsNotEmpty()
   username: string;

   @ApiProperty({
      description: 'Full name of the user',
      example: 'John Doe',
   })
   @IsString()
   @IsNotEmpty()
   name: string;

   @ApiProperty({
      description: 'Password for the account (minimum 8 characters)',
      example: 'password123',
      minLength: 8,
   })
   @IsString()
   @IsNotEmpty()
   @MinLength(8, { message: 'Password minimal harus 8 karakter' })
   password: string;
}
