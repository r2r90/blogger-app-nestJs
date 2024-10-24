import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { NameIsExist } from '../../common/validators/custom-validators/name-is-exist.validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @NameIsExist()
  login: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @NameIsExist()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;
}
