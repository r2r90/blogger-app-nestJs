import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailValidationDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
