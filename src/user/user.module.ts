import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { UserQueryRepository } from './repositories/user.query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../db/for-feature.db';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserQueryRepository],
  imports: [MongooseModule.forFeature(forFeatureDb)],
  exports: [
    UserService,
    UserRepository,
    UserQueryRepository,
    MongooseModule,
  ],
})
export class UserModule {}
