import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionData } from '../../../db/db-mongo/schemas/session-data.schema';

@Injectable()
export class SessionDataRepository {
  constructor(
    @InjectModel(SessionData.name)
    private readonly deviceModel: Model<SessionData>,
  ) {}

  async saveSession(deviceInfo: {
    ip: string;
    title: string;
    lastActiveDate: string;
  }) {
    const ifDeviceIsInList = await this.deviceModel.findOneAndUpdate(
      { ip: deviceInfo.ip },
      { $set: { lastActiveDate: deviceInfo.lastActiveDate } },
      { new: true },
    );
    if (!ifDeviceIsInList) {
      const savedSession = await this.deviceModel.create(deviceInfo);
      return savedSession.save();
    }
  }
}
