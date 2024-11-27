import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ConfirmCodeDto {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  code: string;
}
