import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EmailConfirmationDto {
  @IsUUID()
  @IsNotEmpty()
  confirmationCode: string;

  @IsDate()
  @Type(() => Date)
  expirationDate: Date;

  @IsBoolean()
  isConfirmed: boolean;
}

export class CreateUserDataDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsOptional()
  isAdmin: boolean = false;

  @Type(() => EmailConfirmationDto)
  emailConfirmation: EmailConfirmationDto;

  @IsDate()
  @IsOptional()
  @Type(() => Date) // Transform string into a Date object
  createdAt?: Date | null;

  @IsString()
  @IsOptional()
  recoveryCode?: string | null;
}
