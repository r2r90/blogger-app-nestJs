import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDataDto } from '../dto/create-user-data.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectDataSource() protected readonly db: DataSource,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDataDto) {
    const isUserExist = await this.usersRepository
      .findOne({ where: { login: data.login } })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });

    if (isUserExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user = this.usersRepository.create({
      ...data,
      is_admin: data.isAdmin,
      is_confirmed: data.emailConfirmation.isConfirmed,
      expiration_date: data.emailConfirmation.expirationDate,
      confirmation_code: data.emailConfirmation.confirmationCode,
    });

    await this.usersRepository.save(user).catch((err) => {
      throw new InternalServerErrorException(err.message);
    });

    return {
      id: user.id,
      login: user.login,
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

  async confirmUser(id: string) {
    const confirmUser = await this.usersRepository
      .update(id, {
        is_confirmed: true,
      })
      .catch((err) => {
        throw new InternalServerErrorException(err.message);
      });
    return confirmUser.affected;
  }

  async updateConfirmationCode(email: string, newConfirmationCode: string) {
    const updateCode = await this.usersRepository
      .update({ email }, { confirmation_code: newConfirmationCode })
      .catch((err) => {
        throw new InternalServerErrorException(err.message);
      });
    return !!updateCode;
  }

  async updatePassword(id: string, newPassword: string) {
    // const updatePassword = await this.userModel.findByIdAndUpdate(
    //   { _id: id },
    //   { $set: { password: newPassword, recoveryCode: null } },
    //   { new: true },
    // );
    return true;
  }
}
