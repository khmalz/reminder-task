import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
   @IsString()
   @IsNotEmpty()
   username: string;

   @IsString()
   @IsNotEmpty()
   name: string;

   @IsString()
   @IsNotEmpty()
   @MinLength(8, { message: 'Password minimal harus 8 karakter' })
   password: string;
}
