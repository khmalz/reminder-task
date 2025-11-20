import { IsCuid } from 'src/common/validators/is-custom-cuid.constraint';
import { ApiProperty } from '@nestjs/swagger';

export class TaskIdParamDto {
   @ApiProperty()
   @IsCuid()
   id: string;
}
