import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    protected readonly usersRepository: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello World! ';
  }

  async deleteAllData() {
    await this.usersRepository.clear();
  }
}
