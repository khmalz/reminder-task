import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
   constructor(private readonly prisma: PrismaService) { }

   async create(dto: CreateTaskDto, userId: string) {
      const { categoryIds, ...rest } = dto;

      const task = await this.prisma.task.create({
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
               select: {
                  category: {
                     select: {
                        id: true,
                        title: true,
                        type: {
                           select: { name: true },
                        },
                     },
                  },
               },
            },
         },
      });

      return {
         ...task,
         categoryToTasks: task.categoryToTasks.map(ct => ({
            category: {
               id: ct.category.id,
               title: ct.category.title,
               typeName: ct.category.type.name,
            },
         })),
      };
   }

   async findAll(userId: string) {
      const tasks = await this.prisma.task.findMany({
         where: { userId },
         orderBy: { createdAt: 'desc' },
         include: {
            categoryToTasks: {
               select: {
                  category: {
                     select: {
                        id: true,
                        title: true,
                        type: {
                           select: { name: true },
                        },
                     },
                  },
               },
            },
         },
      });

      return tasks.map(task => ({
         ...task,
         categoryToTasks: task.categoryToTasks.map(ct => ({
            category: {
               id: ct.category.id,
               title: ct.category.title,
               typeName: ct.category.type.name,
            },
         })),
      }));
   }

   async findOne(taskId: string, userId: string) {
      const task = await this.prisma.task.findFirst({
         where: { id: taskId, userId },
         include: {
            categoryToTasks: {
               select: {
                  category: {
                     select: {
                        id: true,
                        title: true,
                        type: {
                           select: { name: true },
                        },
                     },
                  },
               },
            },
         },
      });

      if (!task) {
         throw new NotFoundException('Tugas tidak ditemukan.');
      }

      return {
         ...task,
         categoryToTasks: task.categoryToTasks.map(ct => ({
            category: {
               id: ct.category.id,
               title: ct.category.title,
               typeName: ct.category.type.name,
            },
         })),
      };
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

         const updatedTask = await this.prisma.task.update({
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
                  select: {
                     category: {
                        select: {
                           id: true,
                           title: true,
                           type: {
                              select: { name: true },
                           },
                        },
                     },
                  },
               },
            },
         });

         return {
            ...updatedTask,
            categoryToTasks: updatedTask.categoryToTasks.map(ct => ({
               category: {
                  id: ct.category.id,
                  title: ct.category.title,
                  typeName: ct.category.type.name,
               },
            })),
         };
      }

      const updatedTask = await this.prisma.task.update({
         where: { id: taskId },
         data: rest,
         include: {
            categoryToTasks: {
               select: {
                  category: {
                     select: {
                        id: true,
                        title: true,
                        type: {
                           select: { name: true },
                        },
                     },
                  },
               },
            },
         },
      });

      return {
         ...updatedTask,
         categoryToTasks: updatedTask.categoryToTasks.map(ct => ({
            category: {
               id: ct.category.id,
               title: ct.category.title,
               typeName: ct.category.type.name,
            },
         })),
      };
   }

   async toggleCompleted(taskId: string, userId: string) {
      const task = await this.prisma.task.findFirst({ where: { id: taskId, userId } });

      if (!task) {
         throw new NotFoundException('Tugas tidak ditemukan.');
      }

      const updatedTask = await this.prisma.task.update({
         where: { id: taskId },
         data: { isCompleted: !task.isCompleted },
      });

      return {
         id: updatedTask.id,
         isCompleted: updatedTask.isCompleted,
         message: updatedTask.isCompleted ? 'Tugas ditandai selesai' : 'Tugas ditandai belum selesai',
      };
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
