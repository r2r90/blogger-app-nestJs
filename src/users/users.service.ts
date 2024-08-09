import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { UsersQueryRepository } from './repositories/users.query.repository';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async createUser(createUderData: CreateUserDto) {
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
