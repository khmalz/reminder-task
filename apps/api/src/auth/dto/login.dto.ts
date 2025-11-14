import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
   @ApiProperty({
      description: 'Username for authentication',
      example: 'johndoe',
   })
   @IsString()
   @IsNotEmpty()
   username: string;

   @ApiProperty({
      description: 'Password for authentication',
      example: 'password123',
      minLength: 8,
   })
   @IsString()
   @IsNotEmpty()
   @MinLength(8)
   password: string;
}
