import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SessionData } from '../../db/db-mongo/schemas';
import { Model } from 'mongoose';

@Injectable()
export class SecurityDevicesRepository {
  constructor() {}

  @InjectModel(SessionData.name) private sessionDataModel: Model<SessionData>;

  async getAllActiveDevices(userId: string) {
    return this.sessionDataModel.find({ userId });
  }

  async getDeviceById(deviceId: string) {
    return this.sessionDataModel.findOne({ _id: deviceId });
  }

  async findByUserAndDevice(userId: string, deviceId: string) {
    return this.sessionDataModel.findOne({ _id: deviceId, userId });
  }

  async deleteAllDevicesByUserId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const res = await this.sessionDataModel.deleteMany({
      userId,
      _id: { $ne: deviceId },
    });
    return res.deletedCount > 0;
  }

  async isLoggedDevice(
    deviceId: string,
    userId: string,
  ): Promise<SessionData | null> {
    return this.sessionDataModel.exists({ _id: deviceId, userId }).lean();
  }

  async logoutFromDevice(userId: string, deviceId: string) {
    return this.sessionDataModel.findOneAndDelete({ _id: deviceId, userId });
  }

  async saveSession(
    userId: string,
    deviceInfo: {
      ip: string;
      title: string;
    },
  ) {
    const savedSession = await this.sessionDataModel.create({
      ip: deviceInfo.ip,
      title: deviceInfo.title,
      lastActiveDate: new Date().toISOString(),
      userId,
    });
    return savedSession.save();
  }

  async updateSession(userId: string, refreshToken: string, deviceId: string) {
    await this.sessionDataModel.findOneAndUpdate(
      {
        _id: deviceId,
        userId,
      },
      {
        refreshToken,
        lastActiveDate: new Date().toISOString(),
      },
    );
  }

  async deleteSession(deviceId: string, userId: string) {
    const res = await this.sessionDataModel.findOneAndDelete({
      _id: deviceId,
      userId,
    });

    return !!res;
  }

  async validateRefreshToken(
    userId: string,
    deviceId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const session = await this.sessionDataModel.findOne({
      _id: deviceId,
      userId,
      refreshToken,
    });
    return !!session;
  }
}
