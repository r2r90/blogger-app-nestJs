import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import configuration from '../../config/configuration';

@Injectable()
export class AuthJwtTokenService {
  constructor(private jwtService: JwtService) {}

  async generateRefreshToken({ sub, sessionId }) {
    return this.jwtService.sign(
      { sub, sessionId: sessionId },
      {
        secret: configuration().refreshJwtSecret,
        expiresIn: configuration().refreshJwtExpiresIn,
      },
    );
  }

  async generateTokenPair(userId: string, sessionId: string): Promise<any> {
    const payload = {
      sub: userId,
      sessionId: sessionId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: configuration().accessJwtSecret,
      expiresIn: configuration().accessJwtExpiration,
    });

    const refreshToken = await this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token !');
    }
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  /*
   *  Ip restriction version
   * */

  // async generateTokenPair(userId: string, sessionId: string): Promise<any> {
  //   const payload = {
  //     sub: userId,
  //     sessionId: sessionId,
  //   };
  //
  //   const accessToken = this.jwtService.sign(payload, {
  //     secret: configuration().accessJwtSecret,
  //     expiresIn: configuration().accessJwtExpiration,
  //   });
  //   const refreshToken = await this.generateRefreshToken(userId, sessionId);
  //
  //   return { accessToken, refreshToken };
  // }
}
