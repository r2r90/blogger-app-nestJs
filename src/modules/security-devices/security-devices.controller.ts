import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtRefreshAuthGuard } from '../auth/guards/jwt-refresh-auth.guard';
import { SecurityDevicesService } from './security-devices.service';
import { Request } from 'express';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

  @Get()
  @UseGuards(JwtRefreshAuthGuard)
  async getAll(@Req() req: Request) {
    const userId = req.user.userId;
    return this.securityDevicesService.getAllActiveDevices(userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  @UseGuards(JwtRefreshAuthGuard)
  async terminateAll(@Req() req: Request) {
    const { userId, deviceId } = req.user;
    return this.securityDevicesService.deleteAllSessionsByUserId(
      userId,
      deviceId,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':deviceId')
  @UseGuards(JwtRefreshAuthGuard)
  async terminateSession(
    @Req() req: Request,
    @Param('deviceId') deviceId: string,
  ) {
    const { userId } = req.user;
    const res = await this.securityDevicesService.deleteSessionByDeviceId(
      userId,
      deviceId,
    );

    if (!res) {
      throw new ForbiddenException(
        `You cannot delete Device with id ${deviceId}!`,
      );
    }
  }
}
