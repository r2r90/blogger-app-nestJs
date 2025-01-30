import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import configuration from '../../../config/configuration';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
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
      userId: payload.sub,
      sessionId: payload.sessionId,
      expiresAt: payload.exp,
    };
  }
}
