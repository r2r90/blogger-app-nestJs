import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import configuration from '../../config/configuration';
import { TokenRepository } from '../repositories/token.repository';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly tokenRepository: TokenRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request.cookies.refreshToken;
          if (!data) return null;
          return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configuration().refreshJwtSecret,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      login: payload.login,
      expiresAt: payload.exp,
    };
  }
}
