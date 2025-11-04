import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import type { TypeName } from 'src/types/category';

const typeNameValues: TypeName[] = ['TASK_KIND', 'TASK_TYPE', 'TASK_COLLECTION'];

export class GetCategoryQueryDto {
   @IsString()
   @IsNotEmpty()
   @IsIn(typeNameValues)
   type: TypeName;
}
