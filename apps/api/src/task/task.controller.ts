import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskIdParamDto } from './dto/task-id-param.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskSwagger, DeleteTaskSwagger, FindAllTasksSwagger, FindOneTaskSwagger, ToggleCompletedSwagger, UpdateTaskSwagger } from './swagger/task.swagger';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UsePipes(
   new ValidationPipe({
      whitelist: true,
      transform: true,
   }),
)
export class TaskController {
   constructor(private readonly taskService: TaskService) { }

   @Post()
   @CreateTaskSwagger()
   create(@Body() createTaskDto: CreateTaskDto, @GetUser('userid') userId: string) {
      return this.taskService.create(createTaskDto, userId);
   }

   @Get()
   @FindAllTasksSwagger()
   findAll(@GetUser('userid') userId: string) {
      return this.taskService.findAll(userId);
   }

   @Get(':id')
   @FindOneTaskSwagger()
   findOne(@Param() params: TaskIdParamDto, @GetUser('userid') userId: string) {
      return this.taskService.findOne(params.id, userId);
   }

   @Patch(':id')
   @UpdateTaskSwagger()
   update(@Param() params: TaskIdParamDto, @Body() updateTaskDto: UpdateTaskDto, @GetUser('userid') userId: string) {
      return this.taskService.update(params.id, userId, updateTaskDto);
   }

   @Patch(':id/toggle-completed')
   @ToggleCompletedSwagger()
   toggleCompleted(@Param() params: TaskIdParamDto, @GetUser('userid') userId: string) {
      return this.taskService.toggleCompleted(params.id, userId);
   }

   @Delete(':id')
   @DeleteTaskSwagger()
   remove(@Param() params: TaskIdParamDto, @GetUser('userid') userId: string) {
      return this.taskService.remove(params.id, userId);
   }
}
