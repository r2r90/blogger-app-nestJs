import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from './repositories/token.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../db/schemas';
import configuration from '../config/configuration';

@Injectable()
export class AuthJwtTokenService {
  constructor(
    private jwtService: JwtService,
    private tokenRepository: TokenRepository,
  ) {}

  async generateRefreshToken(
    authUser: User,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const newRefreshToken = this.jwtService.sign(
      { sub: authUser._id, login: authUser.login },
      {
        secret: configuration().refreshJwtSecret,
        expiresIn: configuration().refreshJwtExpiresIn,
      },
    );

    if (currentRefreshToken && currentRefreshTokenExpiresAt) {
      if (
        await this.tokenRepository.isRefreshTokenBlackListed(
          currentRefreshToken,
          authUser._id,
        )
      ) {
        throw new UnauthorizedException('invalid refresh token');
      }

      await this.tokenRepository.saveToken(currentRefreshToken, authUser._id);
    }

    return newRefreshToken;
  }

  async generateTokenPair(
    user: User,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ): Promise<any> {
    const payload = {
      email: user.email,
      login: user.login,
      sub: user._id.toString(),
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: configuration().accessJwtSecret,
      expiresIn: configuration().accessJwtExpiration,
    });

    const refreshToken = await this.generateRefreshToken(
      user,
      currentRefreshToken,
      currentRefreshTokenExpiresAt,
    );

    return { accessToken, refreshToken };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
}
