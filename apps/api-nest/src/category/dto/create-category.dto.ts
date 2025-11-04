import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import type { TypeName } from 'src/types/category';

const typeNameValues: TypeName[] = ['TASK_KIND', 'TASK_TYPE', 'TASK_COLLECTION'];

export class CreateCategoryDto {
   @IsString()
   @IsNotEmpty()
   title: string;

   @IsString()
   @IsNotEmpty()
   @IsIn(typeNameValues)
   categoryTypeName: TypeName;
}
