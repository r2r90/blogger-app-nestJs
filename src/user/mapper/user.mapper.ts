import { Types } from 'mongoose';
import { UserDocument } from '../../db/schemas/users.schema';

export type UserOutputType = {
  id: Types.ObjectId;
  login: string;
  email: string;
  createdAt: string;
};

export const userMapper = (user: UserDocument): UserOutputType => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
