import { NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../../user/entity/user.entity';

export class AuthQueryRepository {
  constructor(@InjectDataSource() protected readonly db: DataSource) {}

  async getUserByConfirmationCode(code: string): Promise<User> {
    const query = `
        SELECT *
        FROM users
        WHERE confirmation_code = $1;
    `;

    const values = [code];
    const result = await this.db.query(query, values);

    if (result.length === 0) {
      throw new NotFoundException('Could not find user with confirmation code');
    }
    return result[0];
  }

  async saveToken(refreshToken: string): Promise<any> {}
}
