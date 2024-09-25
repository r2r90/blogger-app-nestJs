import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { UserQueryRepository } from './repositories/user.query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../db/for-feature.db';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './commands/createUser.use-case';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserQueryRepository,
    CreateUserUseCase,
  ],
  imports: [MongooseModule.forFeature(forFeatureDb), CqrsModule],
  exports: [UserService, UserRepository, UserQueryRepository, MongooseModule],
})
export class UserModule {}
