import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { Session } from '../security-devices/entity/session.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    protected readonly usersRepository: Repository<User>,
    @InjectRepository(Session)
    protected readonly sessionRepository: Repository<Session>,
  ) {}

  getHello(): string {
    return 'Hello World! ';
  }

  async deleteAllData() {
    await this.usersRepository.delete({});
    await this.sessionRepository.delete({});
  }
}
