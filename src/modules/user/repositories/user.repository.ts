import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt,
      };
    } catch (e) {
      console.log(e.message);
    }
  }

  async remove(id: string) {
    return 'remove from sql db';
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
