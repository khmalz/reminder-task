import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import type { TypeName } from 'src/types/category';

const typeNameValues: TypeName[] = ['TASK_KIND', 'TASK_TYPE', 'TASK_COLLECTION'];

export class CreateCategoryDto {
   @ApiProperty({
      description: 'Title of the category',
      example: 'Solo Work',
   })
   @IsString()
   @IsNotEmpty()
   title: string;

   @ApiProperty({
      description: 'Type of the category',
      example: 'TASK_TYPE',
      enum: typeNameValues,
   })
   @IsString()
   @IsNotEmpty()
   @IsIn(typeNameValues)
   categoryTypeName: TypeName;
}
