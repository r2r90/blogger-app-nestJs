import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfirmCodeDto, EmailValidationDto, RegisterUserDto } from './dto';
import { AuthService } from './auth.service';
import { PassportLocalGuard } from './guards/passport.local.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../user/commands/impl/create-user.command.';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { cookieConfig } from './config/cookie-config';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 10000 } })
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

  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-confirmation')
  async confirmRegisterCode(@Body() code: ConfirmCodeDto) {
    return await this.authService.confirmCode(code);
  }

  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(PassportLocalGuard)
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ): Promise<{ accessToken: string }> {
    const { userId } = req.user;
    const userAgent = req.headers['user-agent'];
    const sessionInfo = {
      ip,
      title: userAgent,
      userId,
    };
    const { accessToken, refreshToken } =
      await this.authService.login(sessionInfo);
    res.cookie(cookieConfig.refreshToken.name, refreshToken, {
      ...cookieConfig.refreshToken.options,
    });
    return { accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userId, deviceId } = req.user;
    const currentRefreshToken = req.cookies.refreshToken;

    const { refreshToken, accessToken } = await this.authService.refreshToken(
      userId,
      deviceId,
      currentRefreshToken,
    );

    res.cookie(cookieConfig.refreshToken.name, refreshToken, {
      ...cookieConfig.refreshToken.options,
    });

    return { accessToken };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @UseGuards(JwtRefreshAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    const sessionId = req.user.deviceId;
    const currentRefreshToken = req.cookies.refreshToken;
    await this.authService.logoutFromDevice(sessionId, currentRefreshToken);
    res.clearCookie(cookieConfig.refreshToken.name);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  @UseGuards(JwtAccessAuthGuard)
  async getMe(@Req() req: Request) {
    const userId = req.user.userId;
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    return { email: user.email, login: user.login, userId };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  async passwordRecovery(@Body() dto: EmailValidationDto) {
    const { email } = dto;
    const user = await this.userService.getUserByEmail(email);
    await this.authService.sendRecoveryCode(user.email);
  }

  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-email-resending')
  async registerEmailResend(@Body() email: EmailValidationDto) {
    return this.authService.resendRecoveryCode(email);
  }
}
