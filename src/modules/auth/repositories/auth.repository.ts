import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(@InjectDataSource() protected readonly db: DataSource) {}

  async confirmUser(id: string) {
    const query = `
        UPDATE users
        SET is_confirmed = TRUE
        WHERE user_id = $1
        RETURNING *
    `;
    const confirmUser = await this.db.query(query, [id]);
    return !!confirmUser;
  }

  async updateConfirmationCode(id: string, newCode: string) {
    const query = `
        UPDATE users
        SET confirmation_code = $1
        WHERE user_id = $2
        RETURNING *
    `;
    const updateCode = await this.db.query(query, [newCode, id]);

    return !!updateCode;
  }
}
