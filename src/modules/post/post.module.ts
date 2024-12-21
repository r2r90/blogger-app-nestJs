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
import { UserQueryRepository } from '../user/repositories/user.query.repository';
import { PostMapper } from './mapper/post.mapper';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { BlogIdValidator } from '../../common/validators/custom-validators/blog-id.validator';
import { CommentMapper } from '../comment/mapper/comment.mapper';
import { CommentQueryRepository } from '../comment/repositories/comment.query.repository';

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
    UserQueryRepository,
    UserService,
    UserRepository,
    JwtService,
    BlogIdValidator,
    CommentMapper,
    ...CommandHandlers,
  ],
  imports: [MongooseModule.forFeature(forFeatureDb), CqrsModule],
})
export class PostModule {}
