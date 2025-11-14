import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import type { TypeName } from 'src/types/category';

const typeNameValues: TypeName[] = ['TASK_KIND', 'TASK_TYPE', 'TASK_COLLECTION'];

export class GetCategoryQueryDto {
   @ApiProperty({
      description: 'Type of category to filter by',
      example: 'TASK_TYPE',
      enum: typeNameValues,
      required: true,
   })
   @IsString()
   @IsNotEmpty()
   @IsIn(typeNameValues)
   type: TypeName;
}
