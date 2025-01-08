import { CreateUserDto } from '../../../../db/db-mongo/schemas';
import { UserOutputType } from '../../types';

export interface IUserRepository {
  create: (arg: CreateUserDto) => Promise<UserOutputType>;
  remove: (arg: string) => Promise<{ message: string; affectedRows: number }>;
}
