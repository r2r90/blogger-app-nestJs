import { NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../../user/entity/user.entity';

export class AuthQueryRepository {
  constructor(@InjectDataSource() protected readonly db: DataSource) {}

  async saveToken(refreshToken: string): Promise<any> {}
}
