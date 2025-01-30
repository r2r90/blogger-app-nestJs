import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Like, Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetUsersDto } from '../dto/get-users.dto';
import { userMapper } from '../mapper/user.mapper';
import { User } from '../entity/user.entity';

export class UserQueryRepository {
  @InjectRepository(User)
  private readonly usersRepository: Repository<User>;
  @InjectDataSource()
  protected readonly db: DataSource;
  @InjectModel(User.name) protected readonly userModel: Model<User>;

  async getAll(query: GetUsersDto) {
    const {
      searchLoginTerm,
      searchEmailTerm,
      pageNumber = 1,
      pageSize = 10,
      sortDirection,
      sortBy,
    } = query;

    const validSortFields = ['login', 'email', 'created_at'];
    const sortByField = validSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';

    const whereConditions: any = [];

    if (searchLoginTerm) {
      whereConditions.push({ login: ILike(`%${searchLoginTerm}%`) });
    }

    if (searchEmailTerm) {
      whereConditions.push({ email: Like(`%${searchEmailTerm}%`) });
    }

    const [items, totalCount] = await this.usersRepository.findAndCount({
      where: whereConditions.length > 0 ? whereConditions : undefined,
      order: {
        [sortByField]: sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    return {
      totalCount,
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      items: items.map((user) => userMapper(user)),
    };
  }

  async findUserById(id: string) {
    const user = await this.usersRepository
      .findOne({
        where: { id },
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });

    if (!user) return null;
    return user;
  }

  async getUserByConfirmationCode(code: string): Promise<User> {
    const user = await this.usersRepository
      .findOneBy({
        confirmation_code: code,
      })
      .catch((err) => {
        throw new InternalServerErrorException(err.message);
      });
    return user;
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<User> {
    const userExist = await this.usersRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    if (!userExist) return null;
    return userExist;
  }

  async findUserByEmail(email: string) {
    const findUser = await this.usersRepository.findOneBy({
      email,
    });

    if (!findUser) return null;
    return findUser;
  }

  isEmailExist(email: string) {
    return this.userModel.findOne({
      email: email,
    });
  }

  async getUserByRecoveryCode(code: string) {
    const user = await this.userModel.findOne({
      recoveryCode: code,
    });
    if (!user) return null;
    return user;
  }

  async getUserLoginByPostLikeId(userId: string): Promise<string | null> {
    const getUserQuery = `
        SELECT *
        FROM post_likes
        WHERE user_id = $1
    `;

    const findUser = await this.db.query(getUserQuery, [userId]);
    return findUser[0];
  }
}
