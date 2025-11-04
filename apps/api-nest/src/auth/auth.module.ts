import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
   imports: [
      JwtModule.registerAsync({
         // eslint-disable-next-line @typescript-eslint/require-await
         useFactory: async () => ({
            secret: process.env.SECRET_JWT,
            signOptions: { expiresIn: 60 },
         }),
      }),
      PrismaModule,
   ],
   controllers: [AuthController],
   providers: [AuthService],
})
export class AuthModule {}
