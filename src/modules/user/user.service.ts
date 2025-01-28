import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserQueryRepository } from './repositories/user.query.repository';
import * as bcrypt from 'bcrypt';
import { GetUsersDto } from './dto/get-users.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly usersQueryRepository: UserQueryRepository,
  ) {}

  async getAllUsers(query: GetUsersDto) {
    return this.usersQueryRepository.getAll(query);
  }

  async getUserById(id: string) {
    return this.usersQueryRepository.findUserById(id);
  }

  async getUserByEmail(email: string) {
    const user = this.usersQueryRepository.findUserByEmail(email);
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async getUserByLoginOrEmail(emailOrLogin: string) {
    return this.usersQueryRepository.findUserByFields({
      login: emailOrLogin,
      email: emailOrLogin,
    });
  }

  async deleteUser(userId: string) {
    const findUser = await this.getUserById(userId);
    if (!findUser)
      throw new NotFoundException(`User with id ${userId} not found`);
    await this.usersRepository.remove(userId);
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async updateEmailConfirmationCode(
    email: string,
    newConfirmationCode: string,
  ): Promise<boolean> {
    return await this.usersRepository.updateConfirmationCode(
      email,
      newConfirmationCode,
    );
  }
}
