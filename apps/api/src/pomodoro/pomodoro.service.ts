import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePomodoroLogDto } from './dto/create-pomodoro-log.dto';

@Injectable()
export class PomodoroService {
   constructor(private readonly prisma: PrismaService) {}

   async create(dto: CreatePomodoroLogDto, userId: string) {
      const { taskId, startedAt, endedAt, durationMinutes } = dto;
      const started = new Date(startedAt);
      const ended = new Date(endedAt);

      if (Number.isNaN(started.getTime()) || Number.isNaN(ended.getTime())) {
         throw new BadRequestException('Tanggal mulai/selesai tidak valid.');
      }

      if (ended < started) {
         throw new BadRequestException('Waktu selesai harus setelah waktu mulai.');
      }

      if (taskId) {
         const task = await this.prisma.task.findFirst({
            where: { id: taskId, userId },
            select: { id: true },
         });

         if (!task) {
            throw new NotFoundException('Tugas tidak ditemukan.');
         }
      }

      const log = await this.prisma.pomodoroLog.create({
         data: {
            userId,
            taskId: taskId ?? null,
            durationMinutes,
            startedAt: started,
            endedAt: ended,
         },
         include: {
            task: {
               select: {
                  id: true,
                  title: true,
               },
            },
         },
      });

      return {
         ...log,
         task: log.task
            ? {
                 id: log.task.id,
                 title: log.task.title,
              }
            : null,
      };
   }

   async findAll(userId: string, taskId?: string) {
      if (taskId) {
         const task = await this.prisma.task.findFirst({
            where: { id: taskId, userId },
            select: { id: true },
         });

         if (!task) {
            throw new NotFoundException('Tugas tidak ditemukan.');
         }
      }

      const logs = await this.prisma.pomodoroLog.findMany({
         where: {
            userId,
            ...(taskId ? { taskId } : {}),
         },
         orderBy: { endedAt: 'desc' },
         include: {
            task: {
               select: {
                  id: true,
                  title: true,
               },
            },
         },
      });

      return logs.map(log => ({
         ...log,
         task: log.task
            ? {
                 id: log.task.id,
                 title: log.task.title,
              }
            : null,
      }));
   }
}
