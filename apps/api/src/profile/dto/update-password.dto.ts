import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
   @ApiProperty({
      description: 'Current password for verification',
      example: 'oldpassword123',
      minLength: 8,
   })
   @IsString()
   @IsNotEmpty()
   @MinLength(8)
   oldPassword: string;

   @ApiProperty({
      description: 'New password (minimum 8 characters)',
      example: 'newpassword123',
      minLength: 8,
   })
   @IsString()
   @IsNotEmpty()
   @MinLength(8, { message: 'Password minimal harus 8 karakter' })
   newPassword: string;
}
