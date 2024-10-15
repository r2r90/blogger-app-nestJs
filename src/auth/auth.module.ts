import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthQueryRepository } from './repositories/auth.query.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { UserService } from '../user/user.service';
import { UserQueryRepository } from '../user/repositories/user.query.repository';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { MailService } from '../mail/mail.service';
import { AuthRepository } from './repositories/auth.repository';
import { BasicStrategy } from './strategies/basic-auth.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { options } from './config';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { TokenRepository } from './repositories/token.repository';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    AuthQueryRepository,
    AuthRefreshTokenService,
    TokenRepository,
    BasicStrategy,
    JwtRefreshStrategy,
    MailService,
    UserQueryRepository,
    UserRepository,
    UserService,
    LocalStrategy,
  ],
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync(options()),
    CqrsModule,
  ],
})
export class AuthModule {}
