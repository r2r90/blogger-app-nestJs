import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class NewPasswordDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsUUID()
  @IsNotEmpty()
  @IsString()
  recoveryCode: string;
}
