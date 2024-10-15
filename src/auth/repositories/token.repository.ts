import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from '../../db/schemas/tokens.schema';
import { Model } from 'mongoose';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  async saveToken(refreshToken: string, expiresAt: Date, userId: string) {
    const insertedToken = await this.tokenModel.create({
      refreshToken,
      expiresAt,
      userId,
    });

    return insertedToken.save();
  }

  isRefreshTokenBlackListed(refreshToken: string, userId: string) {
    return this.tokenModel.exists({ refreshToken, userId });
  }
}
