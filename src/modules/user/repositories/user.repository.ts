import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, User } from '../../../db/schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  @InjectModel(User.name) private readonly userModel: Model<User>;

  async create(data: CreateUserDto) {
    const createdAt = new Date().toISOString();
    const createdUser = new this.userModel({
      ...data,
      createdAt,
    });

    const savedUser = await createdUser.save();

    return {
      id: savedUser._id,
      createdAt: savedUser.createdAt,
      email: savedUser.email,
      login: savedUser.login,
    };
  }

  async remove(id: string) {
    const res = await this.userModel.findByIdAndDelete(id);
    if (!res) return null;
    return res;
  }

  async updateConfirmationCode(email: string, recoveryCode: string) {
    const updateCode = await this.userModel.findOneAndUpdate(
      { email },
      { $set: { recoveryCode: recoveryCode } },
      { new: true },
    );

    return !!updateCode;
  }

  async updatePassword(id: string, newPassword: string) {
    const updatePassword = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { $set: { password: newPassword, recoveryCode: null } },
      { new: true },
    );

    return !!updatePassword;
  }
}
