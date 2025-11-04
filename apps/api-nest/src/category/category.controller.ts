import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryQueryDto } from './dto/get-category-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
@UseGuards(JwtAuthGuard)
@UsePipes(
   new ValidationPipe({
      whitelist: true,
      transform: true,
   }),
)
export class CategoryController {
   constructor(private readonly categoryService: CategoryService) {}

   @Post()
   @UseGuards(JwtAuthGuard)
   create(@Body() createCategoryDto: CreateCategoryDto, @GetUser('sub') userId: string) {
      return this.categoryService.create(createCategoryDto, userId);
   }

   @Get()
   findAll(@Query() query: GetCategoryQueryDto, @GetUser('sub') userId: string) {
      return this.categoryService.findAll(query.type, userId);
   }

   @Put(':id')
   update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @GetUser('sub') userId: string) {
      return this.categoryService.update(id, userId, updateCategoryDto);
   }

   @Delete(':id')
   remove(@Param('id') id: string, @GetUser('sub') userId: string) {
      return this.categoryService.remove(id, userId);
   }
}
