import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthQueryRepository } from './repositories/auth.query.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { UserService } from '../user/user.service';
import { UserQueryRepository } from '../user/repositories/user.query.repository';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { options } from './config';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthQueryRepository,
    UserService,
    UserQueryRepository,
    UserRepository,
    MailService
  ],
  imports: [PassportModule, JwtModule.registerAsync(options()), UserModule],
})
export class AuthModule {}
