import { UserOutputType } from '../../types';
import { CreateUserDto } from '../../dto/create.user.dto';

export interface IUserRepository {
  create: (arg: CreateUserDto) => Promise<UserOutputType>;
  remove: (arg: string) => Promise<{ message: string; affectedRows: number }>;
}
