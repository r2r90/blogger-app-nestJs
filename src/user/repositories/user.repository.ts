import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../db/schemas/users.schema';
import { Model } from 'mongoose';
import { UserEmailConfirmation } from '../types';

@Injectable()
export class UserRepository {
  @InjectModel(User.name) private readonly userModel: Model<User>;

  async create(data: {
    login: string;
    email: string;
    password: string;
    emailConfirmation: UserEmailConfirmation;
    createdAt: string;
  }) {
    const createdUser = new this.userModel({
      ...data,
    });

    const savedUser = await createdUser.save();

    return {
      id: savedUser._id,
      createdAt: savedUser.createdAt,
      email: savedUser.email,
      login: savedUser.login,
      emailConfirmation: savedUser.emailConfirmation,
    };
  }

  async remove(id: string) {
    const res = await this.userModel.findByIdAndDelete(id);
    if (!res) return null;
    return res;
  }
}
