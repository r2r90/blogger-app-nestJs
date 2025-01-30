import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SessionInfoDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  ip: string;

  @IsString()
  @IsNotEmpty()
  title: string = 'Unknown device';
}
