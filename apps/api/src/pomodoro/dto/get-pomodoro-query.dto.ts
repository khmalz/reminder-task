import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsCuid } from 'src/common/validators/is-custom-cuid.constraint';

export class GetPomodoroQueryDto {
   @ApiPropertyOptional({
      description: 'Filter logs by task ID',
      example: 'cmhylu9em0007t2xoz82fx2ms',
   })
   @IsOptional()
   @IsCuid()
   taskId?: string;
}
