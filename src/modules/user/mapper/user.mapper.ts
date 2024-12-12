import { User } from '../entity/user.entity';

export type UserOutputType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export const userMapper = (user: User): UserOutputType => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: user.created_at,
  };
};
