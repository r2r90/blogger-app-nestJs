import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SecurityDevicesRepository } from './security-devices.repository';
import { SessionInfoDto } from './dto /session-info.dto';
import { Session } from './entity/session.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class SecurityDevicesService {
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
    private readonly userService: UserService,
  ) {}

  async saveSession(sessionInfo: SessionInfoDto): Promise<Session> {
    // const user = await this.userService.getUserById(sessionInfo.userId);
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }

    return this.securityDevicesRepository.saveSession(sessionInfo);
  }

  async getAllActiveDevices(userId: string) {
    const deviceList =
      await this.securityDevicesRepository.getAllActiveDevices(userId);
    return deviceList.map((device) => ({
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.last_active_date,
      deviceId: device.id,
    }));
  }

  async deleteAllSessionsByUserId(userId: string, deviceId: string) {
    return this.securityDevicesRepository.deleteAllDevicesByUserId(
      userId,
      deviceId,
    );
  }

  async deleteSessionByDeviceId(userId: string, deviceId: string) {
    const isDeviceExist =
      await this.securityDevicesRepository.getDeviceById(deviceId);

    if (!isDeviceExist) {
      throw new NotFoundException(`Device with id ${deviceId} not found`);
    }

    if (isDeviceExist.user_id !== userId) {
      throw new ForbiddenException('Access Limited to edit session!');
    }

    return this.securityDevicesRepository.deleteSession(deviceId);
  }
}
