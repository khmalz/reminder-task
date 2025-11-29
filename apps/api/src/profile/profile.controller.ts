import { Body, Controller, Patch, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateProfileSwagger, UpdatePasswordSwagger } from './swagger/profile.swagger';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UsePipes(
   new ValidationPipe({
      whitelist: true,
      transform: true,
   }),
)
export class ProfileController {
   constructor(private readonly profileService: ProfileService) {}

   @Patch()
   @UpdateProfileSwagger()
   updateProfile(@Body() updateProfileDto: UpdateProfileDto, @GetUser('userid') userId: string) {
      return this.profileService.updateProfile(userId, updateProfileDto);
   }

   @Patch('password')
   @UpdatePasswordSwagger()
   updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @GetUser('userid') userId: string) {
      return this.profileService.updatePassword(userId, updatePasswordDto);
   }
}
