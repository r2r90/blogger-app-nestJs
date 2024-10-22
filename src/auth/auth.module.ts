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
import { JwtTokenService } from './jwt-token.service';
import { TokenRepository } from './repositories/token.repository';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { JwtAccessStrategy } from './strategies/jwt-access-strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    AuthQueryRepository,
    JwtTokenService,
    TokenRepository,
    BasicStrategy,
    JwtRefreshStrategy,
    JwtAccessStrategy,
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
  exports: [
    JwtModule
  ]
})
export class AuthModule {}
