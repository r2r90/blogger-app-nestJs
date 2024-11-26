import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from '../blog/blog.module';
import configuration from '../config/configuration';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../db/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../db/for-feature.db';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtGuard } from '../auth/guards/jwt-guard';
import { NameIsExistConstraint } from '../common/validators/custom-validators/name-is-exist.validator';
import { CommentModule } from '../comment/comment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SecurityDevicesModule } from '../security-devices/security-devices.module';

@Module({
  imports: [
    CqrsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    ScheduleModule.forRoot(),

    MongooseModule.forFeature(forFeatureDb),
    DatabaseModule,
    BlogModule,
    PostModule,
    UserModule,
    AuthModule,
    CommentModule,
    SecurityDevicesModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtGuard,

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    NameIsExistConstraint,
  ],
})
export class AppModule {}
