import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserQueryRepository } from './repositories/user.query.repository';
import { PaginationInputType } from '../../common/pagination/pagination.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly usersQueryRepository: UserQueryRepository,
  ) {}

  async getAllUsers(query: PaginationInputType) {
    return this.usersQueryRepository.getAll(query);
  }

  async getUserById(id: string) {
    return this.usersQueryRepository.findOne(id);
  }

  async getUserByLoginOrEmail(emailOrLogin: string) {
    return this.usersQueryRepository.findByLoginOrEmail(emailOrLogin);
  }

  async deleteUser(userId: string) {
    const findUser = await this.getUserById(userId);
    console.log(findUser);

    if (findUser.length === 0)
      throw new NotFoundException(`User with id ${userId} not found`);
    const isUserDeleted = await this.usersRepository.remove(userId);
    if (!isUserDeleted)
      throw new NotFoundException(`Cannot remove user with id $userId}`);
    return true;
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
