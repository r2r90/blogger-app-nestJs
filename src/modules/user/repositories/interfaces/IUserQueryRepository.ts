import { UserOutputType } from '../../types';

export interface IUserQueryRepository {
  getAll: (arg: string) => Promise<UserOutputType[]>;
  findOne: (arg: string) => Promise<UserOutputType>;
  findUserByFields: (arg: {
    login?: string;
    email: string;
  }) => Promise<UserOutputType>;
}
