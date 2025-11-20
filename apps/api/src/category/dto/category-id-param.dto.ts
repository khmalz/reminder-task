import { IsCuid } from 'src/common/validators/is-custom-cuid.constraint';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryIdParamDto {
   @ApiProperty()
   @IsCuid()
   id: string;
}
