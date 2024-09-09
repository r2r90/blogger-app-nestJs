import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserQueryRepository } from './repositories/user.query.repository';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { User } from '../db/schemas/users.schema';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly usersQueryRepository: UserQueryRepository,
  ) {}

  async createUser(createUderData: CreateUserDto): Promise<Partial<User>> {
    return this.usersRepository.create(createUderData);
  }

  async getAllUsers(query: PaginationInputType) {
    return this.usersQueryRepository.getAll(query);
  }

  async getUserById(id: string) {
    return this.usersQueryRepository.findOne(id);
  }

  async deleteUser(userId: string) {
    const findUser = await this.getUserById(userId);

    if (!findUser)
      throw new NotFoundException(`User with id ${userId} not found`);
    const isUserDeleted = await this.usersRepository.remove(userId);
    if (!isUserDeleted)
      throw new NotFoundException(`Cannot remove user with id ${userId}`);
    return true;
  }

}
