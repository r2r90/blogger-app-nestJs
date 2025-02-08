import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../../db/db-mongo/for-feature.db';
import { PostController } from './post.controller';
import { PostRepository } from './repositories/post.repository';
import { PostQueryRepository } from './repositories/post-query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostHandler } from './commands/handlers/create-post.handler';
import { PostService } from './post.service';
import { CreateCommentHandler } from '../comment/commands/handlers/create-comment.handler';
import { PostMapper } from './mapper/post.mapper';
import { JwtService } from '@nestjs/jwt';
import { BlogIdValidator } from '../../common/validators/custom-validators/blog-id.validator';
import { UserModule } from '../user/user.module';
import { BlogModule } from '../blog/blog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostLike } from './entity/post-likes.entity';
import { CommentModule } from '../comment/comment.module';

export const CommandHandlers = [CreatePostHandler, CreateCommentHandler];

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    PostQueryRepository,
    PostMapper,
    JwtService,
    BlogIdValidator,
    ...CommandHandlers,
  ],
  imports: [
    MongooseModule.forFeature(forFeatureDb),
    TypeOrmModule.forFeature([Post, PostLike]),
    CqrsModule,
    UserModule,
    CommentModule,
    forwardRef(() => BlogModule),
  ],
  exports: [PostRepository, PostQueryRepository, PostService],
})
export class PostModule {}
