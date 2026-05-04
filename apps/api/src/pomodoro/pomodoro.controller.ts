import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PomodoroService } from './pomodoro.service';
import { CreatePomodoroLogDto } from './dto/create-pomodoro-log.dto';
import { GetPomodoroQueryDto } from './dto/get-pomodoro-query.dto';
import { CreatePomodoroLogSwagger, FindAllPomodoroLogsSwagger } from './swagger/pomodoro.swagger';

@ApiTags('Pomodoro')
@Controller('pomodoro')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UsePipes(
   new ValidationPipe({
      whitelist: true,
      transform: true,
   }),
)
export class PomodoroController {
   constructor(private readonly pomodoroService: PomodoroService) {}

   @Post()
   @CreatePomodoroLogSwagger()
   create(@Body() dto: CreatePomodoroLogDto, @GetUser('userid') userId: string) {
      return this.pomodoroService.create(dto, userId);
   }

   @Get()
   @FindAllPomodoroLogsSwagger()
   findAll(@Query() query: GetPomodoroQueryDto, @GetUser('userid') userId: string) {
      return this.pomodoroService.findAll(userId, query.taskId);
   }
}
