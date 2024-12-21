import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SessionData } from '../../db/db-mongo/schemas';
import { Model } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SecurityDevicesRepository {
  constructor(@InjectDataSource() protected readonly db: DataSource) {}

  @InjectModel(SessionData.name) private sessionDataModel: Model<SessionData>;

  async saveSession(
    userId: string,
    deviceInfo: {
      ip: string;
      title: string;
    },
  ) {
    const query = `
        INSERT INTO sessions (user_id, title, ip)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = [userId, deviceInfo.title, deviceInfo.ip];

    const result = await this.db.query(query, values);

    return result;
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
        WHERE id = $1;
    `;

    const device = await this.db.query(query, [deviceId]);
    return device[0];
  }

  async findByUserAndDevice(userId: string, deviceId: string) {
    const query = `SELECT *
                   FROM sessions
                   WHERE user_id = $1
                     AND id = $2`;

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
                     AND id != $2`;

    const res = await this.db.query(query, [userId, deviceId]);

    return res.deletedCount > 0;
  }

  async isLoggedDevice(
    deviceId: string,
    userId: string,
  ): Promise<SessionData | null> {
    return this.sessionDataModel.exists({ _id: deviceId, userId }).lean();
  }

  async logoutFromDevice(userId: string, deviceId: string) {
    const query = `
        DELETE
        FROM sessions
        WHERE id = $1
          AND user_id = $2;
    `;
    return this.db.query(query, [deviceId, userId]);
  }

  async updateSession(userId: string, refreshToken: string, deviceId: string) {
    const query = `
        UPDATE sessions
        SET refresh_token    = $1,
            last_active_date = $2
        WHERE id = $3
          AND user_id = $4
    `;

    const lastActiveDate = new Date().toISOString();
    const values = [refreshToken, lastActiveDate, deviceId, userId];
    const result = await this.db.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(
        'Session not found or user does not have permission to updateBlog this session',
      );
    }
  }

  async deleteSession(deviceId: string, userId: string) {
    const query = `DELETE
                   FROM sessions
                   WHERE id = $1
                     AND user_id = $2`;

    return await this.db.query(query, [deviceId, userId]);
  }

  async validateRefreshToken(
    userId: string,
    deviceId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const query = `
        SELECT *
        FROM sessions
        WHERE id = $1
          AND user_id = $2
          AND refresh_token = $3`;

    const isValidSession = await this.db.query(query, [
      deviceId,
      userId,
      refreshToken,
    ]);

    return isValidSession.length !== 0;
  }
}
