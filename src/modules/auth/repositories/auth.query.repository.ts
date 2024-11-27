import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../db/schemas/users.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

export class AuthQueryRepository {
  @InjectModel(User.name) private readonly userModel: Model<User>;

  async getUserByConfirmationCode(code: string): Promise<User> {
    const user = await this.userModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });

    if (!user) {
      throw new NotFoundException('Could not find user with confirmation code');
    }
    return user;
  }

  async saveToken(refreshToken: string): Promise<any> {

  }
}
