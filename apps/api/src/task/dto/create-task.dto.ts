import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsCuid } from 'src/common/validators/is-custom-cuid.constraint';

export class CreateTaskDto {
   @ApiProperty({
      description: 'Title of the task',
      example: 'Complete project documentation',
   })
   @IsString()
   @IsNotEmpty()
   title: string;

   @ApiProperty({
      description: 'Whether the task is completed or not',
      example: false,
      default: false,
      required: false,
   })
   @IsBoolean()
   @IsOptional()
   isCompleted?: boolean;

   @ApiProperty({
      description: 'Array of category IDs to associate with this task',
      example: ['cmhyltvu10005t2xo0a6mhw7k', 'cmhylpk2y0001t2xotqf0xc7a'],
      type: [String],
      isArray: true,
   })
   @IsArray()
   @ArrayNotEmpty()
   @IsCuid({ each: true })
   categoryIds: string[];
}
