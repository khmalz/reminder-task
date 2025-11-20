import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import type { TypeName } from 'src/types/category';

@Injectable()
export class CategoryService {
   constructor(private prisma: PrismaService) {}

   async getCategoryTypeId(typeName: TypeName): Promise<number> {
      const categoryType = await this.prisma.categoryType.findUnique({
         where: { name: typeName },
         select: { id: true },
      });
      if (!categoryType) {
         throw new NotFoundException(`CategoryType: ${typeName} belum di-seed.`);
      }
      return categoryType.id;
   }

   async create({ title, categoryTypeName }: CreateCategoryDto, userId: string) {
      const typeId = await this.getCategoryTypeId(categoryTypeName);

      const newCategory = await this.prisma.category.create({
         data: {
            title: title,
            typeId: typeId,
            userId: userId,
         },
      });
      return newCategory;
   }

   async findAll(categoryTypeName: string, userId: string) {
      const typeId = await this.getCategoryTypeId(categoryTypeName as TypeName);

      const categories = await this.prisma.category.findMany({
         where: {
            typeId: typeId,
            userId: userId,
         },
         orderBy: { title: 'asc' },
      });

      return categories;
   }

   async update(id: string, userId: string, { title }: UpdateCategoryDto) {
      const existingCategory = await this.prisma.category.findUnique({
         where: { id },
      });

      if (!existingCategory) {
         throw new NotFoundException('Category tidak ditemukan.');
      }

      if (existingCategory.userId !== userId) {
         throw new ForbiddenException('Anda hanya dapat mengubah Category custom milik Anda.');
      }

      return this.prisma.category.update({
         where: { id },
         data: { title },
      });
   }

   async remove(id: string, userId: string) {
      const existingCategory = await this.prisma.category.findUnique({
         where: { id },
      });

      if (!existingCategory) {
         throw new NotFoundException('Category tidak ditemukan.');
      }

      if (existingCategory.userId !== userId) {
         throw new ForbiddenException('Anda hanya dapat mengubah Category custom milik Anda.');
      }

      await this.prisma.category.delete({ where: { id } });
      return { message: 'Category berhasil dihapus.' };
   }
}
