import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
   constructor(private userService: UserService) {}

   @Get()
   findAll() {
      return this.userService.findAll();
   }

   @Post()
   create(@Body() data: { name: string; email: string; password: string }) {
      return this.userService.create(data);
   }
}
