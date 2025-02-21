import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { SessionInfoDto } from './dto /session-info.dto';
import { Session } from './entity/session.entity';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectDataSource() protected readonly db: DataSource,
  ) {}

  async saveSession(sessionInfo: SessionInfoDto) {
    const createSession: Session = this.sessionRepository.create({
      user_id: sessionInfo.userId,
      title: sessionInfo.title,
      ip: sessionInfo.ip,
    });

    const saveSession = await this.sessionRepository
      .save(createSession)
      .catch((err) => {
        throw new HttpException(err.description, err.message);
      });

    return saveSession;
  }

  async getAllActiveDevices(userId: string) {
    return await this.sessionRepository.find({
      where: { user_id: userId },
    });
  }

  async getDeviceById(deviceId: string) {
    return await this.sessionRepository.findOneBy({ id: deviceId });
  }

  async deleteAllDevicesByUserId(userId: string, deviceId: string) {
    return await this.sessionRepository
      .delete({ user_id: userId, id: Not(deviceId) })
      .catch((err) => {
        throw new BadRequestException(err);
      });
  }

  async logoutFromDevice(sessionId: string) {
    return await this.sessionRepository.delete({ id: sessionId });
  }

  async updateSession(sessionId: string, refreshToken: string) {
    const updateSession = await this.sessionRepository.update(
      { id: sessionId },
      {
        refresh_token: refreshToken,
        last_active_date: new Date().toISOString(),
      },
    );

    if (updateSession.raw === 0) {
      throw new Error(
        'Session not found or user does not have permission to updateBlog this session',
      );
    }
  }

  async deleteSession(deviceId: string) {
    return await this.sessionRepository.delete({ id: deviceId });
  }

  async validateRefreshToken(
    sessionId: string,
    currentRefreshToken: string,
  ): Promise<boolean> {
    const isValidSession = await this.sessionRepository.find({
      where: { id: sessionId, refresh_token: currentRefreshToken },
    });

    return isValidSession.length !== 0;
  }
}
