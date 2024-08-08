import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { UsersQueryRepository } from './repositories/users.query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../db/for-feature.db';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository],
  imports: [MongooseModule.forFeature(forFeatureDb)],
})
export class UsersModule {}
