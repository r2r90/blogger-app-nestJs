import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenRepository } from './repositories/token.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../db/schemas/users.schema';
import { cookieConfig } from './config/cookie-config';
import {Response} from 'express'

@Injectable()
export class AuthRefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private tokenRepository: TokenRepository,
  ) {}

  async generateRefreshToken(
    authUser: User,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const newRefreshToken = this.jwtService.sign(
      { sub: authUser._id },
      {
        secret: this.config.get('refreshJwtSecret'),
        expiresIn: this.config.get('refreshJwtExpiresIn'),
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

      await this.tokenRepository.saveToken(
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
        authUser._id,
      );
    }

    return newRefreshToken;
  }

  async generateTokenPair(
    user: User,
    res: Response,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ): Promise<any> {
    const payload = {
      email: user.email,
      login: user.login,
      sub: user._id.toString(),
    };


    res.cookie(
      cookieConfig.refreshToken.name,
      await this.generateRefreshToken(
        user,
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
      ),
      {
        ...cookieConfig.refreshToken.options,
      },
    );

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
