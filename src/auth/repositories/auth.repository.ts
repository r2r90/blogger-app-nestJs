import { Injectable } from '@nestjs/common';
import { User } from '../../db/schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async confirmUser(id: string) {
    const confirmUser = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
      { new: true },
    );

    return !!confirmUser;
  }

  async updateConfirmationCode(id: string, newCode: string) {
    const updateCode = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { $set: { 'emailConfirmation.confirmationCode': newCode } },
      { new: true },
    );

    return !!updateCode;
  }

}
