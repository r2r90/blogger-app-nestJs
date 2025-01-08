import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ICommand } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto implements ICommand {
  @ApiProperty({
    description: 'Login of User',
    example: 'test777',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @ApiProperty({
    description: 'Password of User',
    example: 'PasswordTest-1234567',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  @ApiProperty({
    description: 'Email of User',
    example: 'test-user777@example.com',
  })
  @IsString()
  @IsEmail()
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
