import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
   constructor(private readonly prisma: PrismaService) {}

   async create(dto: CreateTaskDto, userId: string) {
      const { categoryIds, ...rest } = dto;

      return this.prisma.task.create({
         data: {
            ...rest,
            userId: userId,
            categoryToTasks: {
               create: categoryIds.map(categoryId => ({
                  category: {
                     connect: { id: categoryId },
                  },
               })),
            },
         },
         include: {
            categoryToTasks: {
               include: {
                  category: {
                     select: { id: true, title: true, typeId: true },
                  },
               },
            },
         },
      });
   }

   async findAll(userId: string) {
      return this.prisma.task.findMany({
         where: { userId },
         orderBy: { createdAt: 'desc' },
         include: {
            categoryToTasks: {
               include: {
                  category: {
                     select: { id: true, title: true, typeId: true },
                  },
               },
            },
         },
      });
   }

   async findOne(taskId: string, userId: string) {
      const task = await this.prisma.task.findFirst({
         where: { id: taskId, userId },
         include: {
            categoryToTasks: {
               include: {
                  category: {
                     select: { id: true, title: true, typeId: true },
                  },
               },
            },
         },
      });

      if (!task) {
         throw new NotFoundException('Tugas tidak ditemukan.');
      }

      return task;
   }

   async update(taskId: string, userId: string, dto: UpdateTaskDto) {
      const task = await this.prisma.task.findFirst({ where: { id: taskId, userId } });

      if (!task) {
         throw new NotFoundException('Tugas tidak ditemukan.');
      }

      const { categoryIds, ...rest } = dto;

      if (categoryIds !== undefined) {
         await this.prisma.categoryToTask.deleteMany({
            where: { taskId },
         });

         return this.prisma.task.update({
            where: { id: taskId },
            data: {
               ...rest,
               categoryToTasks: {
                  create: categoryIds.map(categoryId => ({
                     category: {
                        connect: { id: categoryId },
                     },
                  })),
               },
            },
            include: {
               categoryToTasks: {
                  include: {
                     category: {
                        select: { id: true, title: true, typeId: true },
                     },
                  },
               },
            },
         });
      }

      return this.prisma.task.update({
         where: { id: taskId },
         data: rest,
         include: {
            categoryToTasks: {
               include: {
                  category: {
                     select: { id: true, title: true, typeId: true },
                  },
               },
            },
         },
      });
   }

   async remove(taskId: string, userId: string) {
      const task = await this.prisma.task.findFirst({ where: { id: taskId, userId } });

      if (!task) {
         throw new NotFoundException('Tugas tidak ditemukan.');
      }

      await this.prisma.task.delete({ where: { id: taskId } });
      return { message: 'Tugas berhasil dihapus' };
   }
}
