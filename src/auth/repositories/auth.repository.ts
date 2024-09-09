import { Injectable } from '@nestjs/common';
import { User } from '../../db/schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>

  ) {}

  async create(data) {
    try {
      const createdUser = new this.userModel({
        ...data,
      });
      await createdUser.save();
      return true;
    } catch (e) {
      console.log('Cannot create user in database: ', e);
    }
  }

  async confirmUser(id: string) {
    const confirmUser = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
      { new: true },
    );

    return !!confirmUser;
  }


}
