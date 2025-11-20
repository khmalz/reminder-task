import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryQueryDto } from './dto/get-category-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategorySwagger, FindAllCategoriesSwagger, UpdateCategorySwagger, DeleteCategorySwagger } from './swagger/category.swagger';
import { CategoryIdParamDto } from './dto/category-id-param.dto';

@ApiTags('Categories')
@Controller('category')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UsePipes(
   new ValidationPipe({
      whitelist: true,
      transform: true,
   }),
)
export class CategoryController {
   constructor(private readonly categoryService: CategoryService) {}

   @Post()
   @CreateCategorySwagger()
   create(@Body() createCategoryDto: CreateCategoryDto, @GetUser('userid') userId: string) {
      return this.categoryService.create(createCategoryDto, userId);
   }

   @Get()
   @FindAllCategoriesSwagger()
   findAll(@Query() query: GetCategoryQueryDto, @GetUser('userid') userId: string) {
      return this.categoryService.findAll(query.type, userId);
   }

   @Put(':id')
   @UpdateCategorySwagger()
   update(@Param() params: CategoryIdParamDto, @Body() updateCategoryDto: UpdateCategoryDto, @GetUser('userid') userId: string) {
      return this.categoryService.update(params.id, userId, updateCategoryDto);
   }

   @Delete(':id')
   @DeleteCategorySwagger()
   remove(@Param() params: CategoryIdParamDto, @GetUser('userid') userId: string) {
      return this.categoryService.remove(params.id, userId);
   }
}
