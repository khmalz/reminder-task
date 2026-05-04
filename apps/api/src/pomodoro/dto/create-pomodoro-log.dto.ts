import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { IsCuid } from 'src/common/validators/is-custom-cuid.constraint';

export class CreatePomodoroLogDto {
   @ApiProperty({
      description: 'Duration of the pomodoro session in minutes',
      example: 25,
   })
   @IsInt()
   @Min(1)
   durationMinutes: number;

   @ApiProperty({
      description: 'Start time of the pomodoro session (ISO 8601)',
      example: '2026-05-04T08:30:00.000Z',
   })
   @IsDateString()
   startedAt: string;

   @ApiProperty({
      description: 'End time of the pomodoro session (ISO 8601)',
      example: '2026-05-04T08:55:00.000Z',
   })
   @IsDateString()
   endedAt: string;

   @ApiPropertyOptional({
      description: 'Optional task ID to associate with the session',
      example: 'cmhylu9em0007t2xoz82fx2ms',
   })
   @IsOptional()
   @IsCuid()
   taskId?: string;
}
