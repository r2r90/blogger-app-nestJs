import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { User } from '../common/schemas/users.schema';
import { UsersQueryRepository } from './repositories/users.query.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async createUser(createUderData) {
    return this.usersRepository.create(createUderData);
  }

  async getAllUsers(query): Promise<User[]> {
    return this.usersQueryRepository.getAll(query);
  }
}
