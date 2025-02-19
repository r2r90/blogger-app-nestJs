import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthQueryRepository } from './repositories/auth.query.repository';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { MailService } from '../mail/mail.service';
import { AuthRepository } from './repositories/auth.repository';
import { BasicStrategy } from './strategies/basic-auth.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { options } from './config';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthJwtTokenService } from './auth-jwt-token.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { JwtAccessStrategy } from './strategies/jwt-access-strategy';
import { SecurityDevicesModule } from '../security-devices/security-devices.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    AuthQueryRepository,
    AuthJwtTokenService,
    BasicStrategy,
    JwtRefreshStrategy,
    JwtAccessStrategy,
    MailService,
    LocalStrategy,
  ],
  imports: [
    PassportModule,
    SecurityDevicesModule,
    UserModule,
    JwtModule.registerAsync(options()),
    CqrsModule,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
