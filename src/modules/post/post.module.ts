import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../../db/db-mongo/for-feature.db';
import { PostController } from './post.controller';
import { PostRepository } from './repositories/post.repository';
import { BlogQueryRepository } from '../blog/repositories/blog.query.repository';
import { PostQueryRepository } from './repositories/post-query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostHandler } from './commands/handlers/create-post.handler';
import { BlogRepository } from '../blog/repositories/blog.repository';
import { PostService } from './post.service';
import { CreateCommentHandler } from '../comment/commands/handlers/create-comment.handler';
import { CommentRepository } from '../comment/repositories/comment.repository';
import { PostMapper } from './mapper/post.mapper';
import { JwtService } from '@nestjs/jwt';
import { BlogIdValidator } from '../../common/validators/custom-validators/blog-id.validator';
import { CommentMapper } from '../comment/mapper/comment.mapper';
import { CommentQueryRepository } from '../comment/repositories/comment.query.repository';
import { UserModule } from '../user/user.module';

export const CommandHandlers = [CreatePostHandler, CreateCommentHandler];

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    PostQueryRepository,
    PostMapper,
    BlogQueryRepository,
    BlogRepository,
    CommentRepository,
    CommentQueryRepository,
    JwtService,
    BlogIdValidator,
    CommentMapper,
    ...CommandHandlers,
  ],
  imports: [MongooseModule.forFeature(forFeatureDb), CqrsModule, UserModule],
})
export class PostModule {}
