import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../db/db-mongo/schemas';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(@InjectDataSource() protected readonly db: DataSource) {}

  async create(data: CreateUserDto) {
    const { login, email, password, emailConfirmation } = data;
    const createdAt = new Date().toISOString();

    const query = `
        INSERT INTO users (login, email, password, confirmation_code, expiration_date, is_confirmed, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [
      login,
      email,
      password,
      emailConfirmation.confirmationCode || null,
      emailConfirmation.expirationDate || null,
      emailConfirmation.isConfirmed || null,
      createdAt,
    ];

    const res = await this.db.query(query, values);

    if (!res || !res.rows || res.rows.length === 0) {
      throw new Error(
        'User creation failed: no data returned from the database',
      );
    }

    const user = res[0];

    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt,
    };
  }
}
