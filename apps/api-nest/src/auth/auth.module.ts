import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

const JwtModuleAsync = JwtModule.registerAsync({
   // eslint-disable-next-line @typescript-eslint/require-await
   useFactory: async () => ({
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '1d' },
   }),
});

@Module({
   imports: [JwtModuleAsync, PrismaModule],
   controllers: [AuthController],
   providers: [AuthService, JwtAuthGuard],
   exports: [JwtAuthGuard, JwtModuleAsync],
})
export class AuthModule {}
