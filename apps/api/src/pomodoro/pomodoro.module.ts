import { Module } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { PomodoroController } from './pomodoro.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
   imports: [AuthModule],
   controllers: [PomodoroController],
   providers: [PomodoroService],
})
export class PomodoroModule {}
