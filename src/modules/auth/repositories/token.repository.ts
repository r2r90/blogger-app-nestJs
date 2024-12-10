import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from '../../../db/db-mongo/schemas/tokens.schema';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  async saveToken(refreshToken: string, userId: string) {
    const insertedToken = await this.tokenModel.create({
      refreshToken,
      userId,
    });

    return insertedToken.save();
  }

  isRefreshTokenBlackListed(refreshToken: string, userId: string) {
    return this.tokenModel.findOne({ refreshToken, userId });
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async clearExpiredRefreshTokens() {
    const now = new Date();

    try {
      const result = await this.tokenModel.deleteMany({
        expiresAt: { $lte: now },
      });
      console.log(`Deleted ${result.deletedCount} expired tokens.`);
    } catch (error) {
      console.error('Error clearing expired refresh tokens:', error);
    }
  }
}
