import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
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

    const whereConditions: any = {};

    if (searchLoginTerm) {
      whereConditions.login = Like(`%${searchLoginTerm}%`);
    }

    if (searchEmailTerm) {
      whereConditions.email = Like(`%${searchEmailTerm}%`);
    }

    const validSortFields = ['id', 'login', 'email'];
    const orderByField = validSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';

    const totalCount = await this.usersRepository.count({
      where: whereConditions,
    });

    const items = await this.usersRepository.find({
      where: whereConditions,
      order: {
        [orderByField]: sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
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

  async findUserByFields(fields: { login?: string; email?: string }) {
    const conditions = [];
    const values = [];

    // Формируем условия на основе переданных полей
    if (fields.login) {
      conditions.push(`COALESCE(login, '') ILIKE $${conditions.length + 1}`);
      values.push(fields.login);
    }
    if (fields.email) {
      conditions.push(`COALESCE(email, '') ILIKE $${conditions.length + 1}`);
      values.push(fields.email);
    }

    if (conditions.length === 0) {
      throw new BadRequestException(
        'At least one field (login or email) is required',
      );
    }

    const query = `
        SELECT *
        FROM users
        WHERE ${conditions.join(' OR ')}
    `;

    const findUser = await this.db.query(query, values);

    return findUser[0];
  }

  async findUserByLogin(login: string) {
    if (!login) {
      throw new BadRequestException('Login is required');
    }
    const query = `
        SELECT *
        FROM users
        WHERE COALESCE(login, '') ILIKE $1
    `;

    const findUser = await this.db.query(query, [login]);

    if (findUser.length === 0) {
      new NotFoundException(`Login ${login} not found`);
    }
    return findUser[0];
  }

  async findUserByEmail(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const query = `
        SELECT *
        FROM users
        WHERE COALESCE(email, '') ILIKE $1
    `;

    const findUser = await this.db.query(query, [email]);
    if (findUser.length === 0) {
      new NotFoundException(`Login ${email} not found`);
    }
    return findUser[0];
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
