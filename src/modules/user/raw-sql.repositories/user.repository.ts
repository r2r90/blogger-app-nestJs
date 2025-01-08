import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../db/db-mongo/schemas';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IUserRepository } from '../repositories/user.repository';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectDataSource() protected readonly db: DataSource) {}

  async create(data: CreateUserDto) {
    const { login, email, password, emailConfirmation } = data;
    const createdAt = new Date().toISOString();

    const query = `
        INSERT INTO users (login, email, password, confirmation_code, expiration_date, is_confirmed, created_At)
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

    try {
      const res = await this.db.query(query, values);
      if (!res || res.length === 0) {
        new HttpException(
          'User creation failed: no data returned from the database',
          HttpStatus.INTERNAL_SERVER_ERROR, // Use appropriate status
        );
      }
      const user = res[0];

      return {
        id: user.user_id,
        login: user.login,
        email: user.email,
        createdAt,
      };
    } catch (e) {
      console.log(e.message);
    }
  }

  async remove(id: string) {
    const query = `
        DELETE
        FROM users
        WHERE user_id = $1;
    `;

    const result = await this.db.query(query, [id]);

    return {
      message: `User with id ${id} has been removed`,
      affectedRows: result.rowCount,
    };
  }

  async updateConfirmationCode(email: string, recoveryCode: string) {
    //   const updateCode = await this.userModel.findOneAndUpdate(
    //     { email },
    //     { $set: { recoveryCode: recoveryCode } },
    //     { new: true },
    //   );
    //
    //   return !!updateCode;
    // }
    //
    // async updatePassword(id: string, newPassword: string) {
    //   const updatePassword = await this.userModel.findByIdAndUpdate(
    //     { _id: id },
    //     { $set: { password: newPassword, recoveryCode: null } },
    //     { new: true },
    //   );
    return true;
  }
}
