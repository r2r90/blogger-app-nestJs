import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { ConfirmCodeDto, LoginUserDto, RegisterUserDto } from './dto';
import { AuthService } from './auth.service';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @HttpCode(204)
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.authService.register(dto);
    if (!user)
      throw new BadRequestException(
        `Can't register user with data: ${JSON.stringify(dto)}`,
      );
    return user;
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async confirmRegisterCode(@Body() code: ConfirmCodeDto) {
    return await this.authService.confirmCode(code);
  }

  @Post('registration-email-resending')
  @Post('password-recovery')
  @Post('new-password')
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const user = await this.authService.login(dto);
  }

  @Get('me')
  async getMe(@Param() id: string) {}
}
