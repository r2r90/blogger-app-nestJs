import { User } from '../../db/schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationInputType } from '../../common/pagination/pagination.types';
import { userMapper } from '../mapper/user.mapper';

export class UserQueryRepository {

  @InjectModel(User.name) private readonly userModel: Model<User>;

  async getAll(query: PaginationInputType) {
    const {
      searchLoginTerm,
      searchEmailTerm,
      pageNumber,
      pageSize,
      sortDirection,
      sortBy,
    } = query;

    let filter = {};
    const filterOptions = [];
    if (searchLoginTerm) {
      filterOptions.push({
        login: {
          $regex: new RegExp(searchLoginTerm, 'i'),
        },
      });
    }

    if (searchEmailTerm) {
      filterOptions.push({
        email: {
          $regex: new RegExp(searchEmailTerm, 'i'),
        },
      });
    }

    if (filterOptions.length) {
      filter = { $or: filterOptions };
    }

    const users = await this.userModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    const totalCount = await this.userModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: users.map(userMapper),
    };
  }

  async findOne(id: string) {
    const findUser = await this.userModel.findById(id);
    if (!findUser) return null;
    return findUser;
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const user = await this.userModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    if (!user) return null;
    return user;
  }

  isEmailExist(email: string) {

    return this.userModel.findOne({
      email: email,
    });
  }

  async getUserByRecoveryCode(code: string) {
    const user = await this.userModel.findOne({
      'recoveryCode': code,
    });
    if (!user) return null;
    return user;
  }


}
