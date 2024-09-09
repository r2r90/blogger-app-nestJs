import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../db/schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create.user.dto';

@Injectable()
export class UserRepository {
  @InjectModel(User.name) private readonly userModel: Model<User>;

  async create(createUserDto: CreateUserDto) {
    const createdAt = new Date().toISOString();
    const createdUser = new this.userModel({
      ...createUserDto,
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


}
