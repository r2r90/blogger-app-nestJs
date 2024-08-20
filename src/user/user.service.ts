import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserQueryRepository } from './repositories/user.query.repository';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { User } from '../db/schemas/users.schema';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly usersQueryRepository: UserQueryRepository,
  ) {}

  async save(user: Partial<User>) {
    const hashedPassword = await this.hashPassword(user.password);
    const randomConfirmationCode = uuidv4();

    const savedUser = await this.usersRepository.create({
      login: user.login,
      email: user.email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomConfirmationCode,
        expirationDate: add(new Date(), { hours: 1 }).toISOString(),
        isConfirmed: false,
      },
    });


    return savedUser;
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

  async findByLoginOrEmail(emailOrLogin: string): Promise<User> {
    return await this.usersQueryRepository.findByLoginOrEmail(emailOrLogin);
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
