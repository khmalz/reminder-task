import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
   constructor(private prisma: PrismaService) {}

   async findAll() {
      return this.prisma.user.findMany();
   }

   async create(data: { name: string; email: string; password: string }) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;

      return this.prisma.user.create({
         data,
      });
   }
}
