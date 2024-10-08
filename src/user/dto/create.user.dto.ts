import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ICommand } from '@nestjs/cqrs';



export class CreateUserDto implements ICommand{
  @IsNotEmpty()
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsEmail()
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
