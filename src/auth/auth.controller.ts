import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('registration')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.authService.register(dto);
    if (!user)
      throw new BadRequestException(
        `Can't register user with data: ${JSON.stringify(dto)}`,
      );
  }

  @Post('registration-confirmation')
  confirmRegisterCode(@Query('code') code: string) {
    console.log(code);
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
