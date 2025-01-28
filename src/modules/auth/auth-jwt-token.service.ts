import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import configuration from '../../config/configuration';

@Injectable()
export class AuthJwtTokenService {
  constructor(private jwtService: JwtService) {}

  async generateRefreshToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: configuration().refreshJwtSecret,
        expiresIn: configuration().refreshJwtExpiresIn,
      },
    );
  }

  async generateTokenPair(userId: string): Promise<any> {
    const payload = {
      sub: userId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: configuration().accessJwtSecret,
      expiresIn: configuration().accessJwtExpiration,
    });
    const refreshToken = await this.generateRefreshToken(userId);

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

  // async generateTokenPair(userId: string, deviceId: string): Promise<any> {
  //   const payload = {
  //     sub: userId,
  //     deviceId: deviceId,
  //   };
  //
  //   const accessToken = this.jwtService.sign(payload, {
  //     secret: configuration().accessJwtSecret,
  //     expiresIn: configuration().accessJwtExpiration,
  //   });
  //   const refreshToken = await this.generateRefreshToken(userId, deviceId);
  //
  //   return { accessToken, refreshToken };
  // }
}
