import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfirmCodeDto, EmailValidationDto, RegisterUserDto } from './dto';
import { AuthService } from './auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { PassportLocalGuard } from './guards/passport.local.guard';

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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-confirmation')
  async confirmRegisterCode(@Body() code: ConfirmCodeDto) {
    return await this.authService.confirmCode(code);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(PassportLocalGuard)
  async login(@Request() request: any) {
    return this.authService.signIn(request.user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-email-resending')
  async registerEmailResend(@Body() email: EmailValidationDto) {
    return this.authService.resendValidationEmail(email);
  }

  @Post('password-recovery')
  async passwordRecoveryRequest() {}

  @Post('new-password')
  async newPasswordCreate() {}

  @Get('me')
  async getMe(@Param() id: string) {}
}
