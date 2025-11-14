import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
   constructor(
      private prisma: PrismaService,
      private jwtService: JwtService,
   ) {}

   async register(registerDto: RegisterDto) {
      const { username, password, name } = registerDto;

      const userExists = await this.prisma.user.findUnique({
         where: { username },
      });

      if (userExists) {
         throw new ConflictException('Username sudah terdaftar');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.user.create({
         data: {
            username,
            name,
            password: hashedPassword,
         },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = newUser;
      return result;
   }

   async login(loginDto: LoginDto) {
      const { username, password } = loginDto;

      const user = await this.prisma.user.findUnique({
         where: { username },
      });

      if (!user) {
         throw new UnauthorizedException('Username atau password salah');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         throw new UnauthorizedException('Username atau password salah');
      }

      const payload = { sub: user.id, username: user.username };

      return {
         access_token: await this.jwtService.signAsync(payload),
      };
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   async logout() {
      return {
         message: 'Logout berhasil. Pastikan token dihapus di sisi klien.',
      };
   }
}
