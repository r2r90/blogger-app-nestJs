import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from '../blog/blog.module';
import configuration from '../../config/configuration';
import { ConfigModule } from '@nestjs/config';
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
import { UserAlreadyExistConstraint } from '../../common/validators/custom-validators/name-is-exist.validator';
import { CommentModule } from '../comment/comment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SecurityDevicesModule } from '../security-devices/security-devices.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Session } from '../security-devices/entity/session.entity';
import { Blog } from '../blog/entity/blog.entity';
import { Post } from '../post/entity/post.entity';
import { PostLike } from '../post/entity/post-likes.entity';
import { Comment } from '../comment/entity/comment.entity';
import { CommentLike } from '../comment/entity/comment-likes.entity';

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
        ttl: 9000,
        limit: 5,
      },
    ]),

    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      User,
      Session,
      Blog,
      Post,
      PostLike,
      Comment,
      CommentLike,
    ]),
    UserModule,
    BlogModule,
    PostModule,
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
    UserAlreadyExistConstraint,
  ],
})
export class AppModule {}
