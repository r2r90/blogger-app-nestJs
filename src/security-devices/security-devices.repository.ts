import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SessionData } from '../db/schemas';
import { Model } from 'mongoose';

@Injectable()
export class SecurityDevicesRepository {
  constructor() {}

  @InjectModel(SessionData.name) private sessionDataModel: Model<SessionData>;

  async getAllActiveDevices(userId: string) {
    return this.sessionDataModel.find({ userId });
  }

  async logoutFromDevice(userId: string, ip: string) {
    return this.sessionDataModel.findOneAndDelete({ userId, ip });
  }

  async saveSession(deviceInfo: {
    ip: string;
    title: string;
    lastActiveDate: string;
  }) {
    const ifDeviceIsInList = await this.sessionDataModel.findOneAndUpdate(
      { ip: deviceInfo.ip },
      { $set: { lastActiveDate: deviceInfo.lastActiveDate } },
      { new: true },
    );
    if (!ifDeviceIsInList) {
      const savedSession = await this.sessionDataModel.create(deviceInfo);
      return savedSession.save();
    }
  }
}
