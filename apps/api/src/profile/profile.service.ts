import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
   constructor(private prisma: PrismaService) {}

   async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
      const { username, name } = updateProfileDto;

      // Check if user exists
      const user = await this.prisma.user.findUnique({
         where: { id: userId },
      });

      if (!user) {
         throw new NotFoundException('User tidak ditemukan');
      }

      // Check if new username is already taken by another user
      if (username !== user.username) {
         const existingUser = await this.prisma.user.findUnique({
            where: { username },
         });

         if (existingUser) {
            throw new ConflictException('Username sudah digunakan oleh user lain');
         }
      }

      const updatedUser = await this.prisma.user.update({
         where: { id: userId },
         data: {
            username,
            name,
         },
         select: {
            id: true,
            username: true,
            name: true,
            createdAt: true,
            updatedAt: true,
         },
      });

      return updatedUser;
   }

   async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
      const { oldPassword, newPassword } = updatePasswordDto;

      // Get user with password
      const user = await this.prisma.user.findUnique({
         where: { id: userId },
      });

      if (!user) {
         throw new NotFoundException('User tidak ditemukan');
      }

      // Verify old password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isOldPasswordValid) {
         throw new UnauthorizedException('Password lama tidak sesuai');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
         where: { id: userId },
         data: {
            password: hashedNewPassword,
         },
      });

      return {
         message: 'Password berhasil diupdate',
      };
   }
}
