import prisma from "../lib/prisma";

interface TaskInput {
   title: string;
   completed?: boolean;
}

export const TaskService = {
   async create(data: TaskInput, userId: string) {
      return prisma.task.create({
         data: {
            title: data.title,
            completed: data.completed || false,
            userId: userId,
         },
      });
   },

   async findAll(userId: string) {
      return prisma.task.findMany({
         where: { userId },
         orderBy: { createdAt: "desc" },
      });
   },

   async findOne(taskId: string, userId: string) {
      const task = await prisma.task.findUnique({
         where: { id: taskId, userId },
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

      return prisma.task.update({
         where: { id: taskId },
         data,
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
