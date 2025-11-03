import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

export interface TaskInput {
   title: string;
   isCompleted?: boolean;
   categoryIds: string[];
}

export const TaskService = {
   async create(data: TaskInput, userId: string) {
      const { categoryIds, ...rest } = data;

      if (categoryIds.length === 0) {
         throw new Error("Tugas harus memiliki setidaknya satu kategori.");
      }

      return prisma.task.create({
         data: {
            ...rest,
            userId: userId,
            categories: {
               connect: categoryIds.map(id => ({ id: id })),
            },
         },
      });
   },

   async findAll(userId: string) {
      return prisma.task.findMany({
         where: { userId },
         orderBy: { createdAt: "desc" },
         include: {
            categories: {
               select: { id: true, title: true, typeId: true },
            },
         },
      });
   },

   async findOne(taskId: string, userId: string) {
      const task = await prisma.task.findUnique({
         where: { id: taskId, userId },
         include: {
            categories: {
               select: { id: true, title: true, typeId: true },
            },
         },
      });

      if (!task) {
         throw new Error("Tugas tidak ditemukan atau bukan milik Anda.");
      }

      return task;
   },

   async update(taskId: string, userId: string, data: Partial<TaskInput>) {
      const task = await prisma.task.findUnique({ where: { id: taskId, userId } });

      if (!task) {
         throw new Error("Tugas tidak ditemukan atau bukan milik Anda.");
      }

      const { categoryIds, ...rest } = data;
      let updateData: Prisma.TaskUpdateInput = rest;

      if (categoryIds) {
         updateData.categories = {
            set: categoryIds.map(id => ({ id: id })),
         };
      }

      return prisma.task.update({
         where: { id: taskId },
         data: updateData,
      });
   },

   async delete(taskId: string, userId: string) {
      const task = await prisma.task.findUnique({ where: { id: taskId, userId } });

      if (!task) {
         throw new Error("Tugas tidak ditemukan atau bukan milik Anda.");
      }

      await prisma.task.delete({ where: { id: taskId } });
      return { message: "Tugas berhasil dihapus" };
   },
};
