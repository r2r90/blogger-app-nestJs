import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create.user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../common/schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
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
}
