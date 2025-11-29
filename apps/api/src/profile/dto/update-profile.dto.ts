import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {
   @ApiProperty({
      description: 'New username for the user',
      example: 'johndoe_updated',
   })
   @IsString()
   @IsNotEmpty()
   username: string;

   @ApiProperty({
      description: 'New name for the user',
      example: 'John Doe Updated',
   })
   @IsString()
   @IsNotEmpty()
   name: string;
}
