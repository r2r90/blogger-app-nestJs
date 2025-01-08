import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../db/db-mongo/schemas';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectDataSource() protected readonly db: DataSource) {}

  async create(data: CreateUserDto) {
    const { login, email, password, emailConfirmation } = data;
    const createdAt = new Date().toISOString();
    return;
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
