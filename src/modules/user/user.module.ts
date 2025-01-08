import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { UserQueryRepository } from './repositories/user.query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../../db/db-mongo/for-feature.db';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { MailService } from '../mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserQueryRepository,
    CreateUserHandler,
    MailService,
  ],
  imports: [
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature(forFeatureDb),
    CqrsModule,
  ],
  exports: [UserService, UserRepository, UserQueryRepository, MongooseModule],
})
export class UserModule {}
