import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SessionData } from '../../db/db-mongo/schemas';
import { Model } from 'mongoose';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SessionInfoDto } from './dto /session-info.dto';
import { Session } from './entity/session.entity';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectDataSource() protected readonly db: DataSource,
  ) {}

  @InjectModel(SessionData.name) private sessionDataModel: Model<SessionData>;

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
    const query = `SELECT *
                   FROM sessions
                   WHERE user_id = $1`;
    const sessions = await this.db.query(query, [userId]);
    return sessions;
  }

  async getDeviceById(deviceId: string) {
    const query = `
        SELECT *
        FROM sessions
        WHERE session_id = $1;
    `;

    const device = await this.db.query(query, [deviceId]);
    return device[0];
  }

  async findByUserAndDevice(userId: string, deviceId: string) {
    const query = `SELECT *
                   FROM sessions
                   WHERE user_id = $1
                     AND session_id = $2`;

    const res = await this.db.query(query, [userId, deviceId]);

    return res[0];
  }

  async deleteAllDevicesByUserId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const query = `DELETE
                   FROM sessions
                   WHERE user_id = $1
                     AND session_id != $2`;

    const res = await this.db.query(query, [userId, deviceId]);

    return res.deletedCount > 0;
  }

  async isLoggedDevice(
    deviceId: string,
    userId: string,
  ): Promise<SessionData | null> {
    return this.sessionDataModel.exists({ _id: deviceId, userId }).lean();
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

  async deleteSession(deviceId: string, userId: string) {
    const query = `DELETE
                   FROM sessions
                   WHERE session_id = $1
                     AND user_id = $2`;

    return await this.db.query(query, [deviceId, userId]);
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
