import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../../../db/db-mongo/schemas';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectDataSource() protected readonly db: DataSource,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    const isUserExist = await this.usersRepository
      .findOne({ where: { login: data.login } })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });

    if (isUserExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user = this.usersRepository.create({ ...data });
    const savedUser = await this.usersRepository.save(user);

    return {
      id: user.id,
      login: savedUser.login,
      email: user.email,
      createdAt: user.created_at,
    };
  }

  async remove(id: string) {
    const result = await this.usersRepository.delete(id);

    return {
      message: `User with id ${id} has been removed`,
      affectedRows: result,
    };
  }

  async updateConfirmationCode(email: string, recoveryCode: string) {
    //   const updateCode = await this.userModel.findOneAndUpdate(
    //     { email },
    //     { $set: { recoveryCode: recoveryCode } },
    //     { new: true },
    //   );
    //
    //   return !!updateCode;
    // }
    //
    // async updatePassword(id: string, newPassword: string) {
    //   const updatePassword = await this.userModel.findByIdAndUpdate(
    //     { _id: id },
    //     { $set: { password: newPassword, recoveryCode: null } },
    //     { new: true },
    //   );
    return true;
  }
}
