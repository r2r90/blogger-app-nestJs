import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ConfirmCodeDto,
  EmailValidationDto,
  NewPasswordDto,
  RegisterUserDto,
} from './dto';
import { AuthService } from './auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { PassportLocalGuard } from './guards/passport.local.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../user/commands/impl/create-user.command.';
import { Request, Response } from 'express';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { UserService } from '../user/user.service';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';

@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('registration')
  @HttpCode(204)
  async register(@Body() dto: RegisterUserDto) {
    const isAdmin = false;
    const { login, email, password } = dto;
    const user = await this.commandBus.execute(
      new CreateUserCommand(login, password, email, isAdmin),
    );
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
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(res, req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  @UseGuards(JwtAccessAuthGuard)
  async getMe(@Req() req: Request) {
    const userId = req.user.id.toString();
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    return { email: user.email, login: user.login, userId };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  async passwordRecovery(@Body() dto: EmailValidationDto) {
    const { email } = dto;
    const user = await this.userService.getUserByLoginOrEmail(email);
    if (!user) throw new BadRequestException('User not found');
    await this.authService.sendRecoveryCode(email);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-email-resending')
  async registerEmailResend(@Body() email: EmailValidationDto) {
    return this.authService.resendValidationEmail(email);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('new-password')
  async newPasswordUpdate(@Body() dto: NewPasswordDto) {
    const { newPassword, recoveryCode } = dto;
    await this.authService.updatePasswordWithRecoveryCode(
      newPassword,
      recoveryCode,
    );
  }
}
