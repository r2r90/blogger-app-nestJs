import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../db/for-feature.db';
import { BlogRepository } from './repositories/blog.repository';
import { BlogQueryRepository } from './repositories/blog.query.repository';
import { PostRepository } from '../post/repositories/post.repository';
import { PostQueryRepository } from '../post/repositories/post-query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogHandler } from './commands/handlers/create-blog.handler';
import { CreatePostHandler } from '../post/commands/handlers/create-post.handler';
import { BlogService } from './blog.service';
import { PostMapper } from '../post/mapper/post.mapper';
import { UserQueryRepository } from '../user/repositories/user.query.repository';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/repositories/user.repository';
import { CommentMapper } from '../comment/mapper/comment.mapper';
import { CommentRepository } from '../comment/repositories/comment.repository';

export const CommandHandlers = [CreateBlogHandler, CreatePostHandler];

@Module({
  controllers: [BlogController],
  providers: [
    BlogRepository,
    BlogQueryRepository,
    PostQueryRepository,
    PostRepository,
    BlogService,
    PostMapper,
    UserQueryRepository,
    UserService,
    JwtService,
    UserRepository,
    CommentMapper,
    CommentRepository,
    ...CommandHandlers,
  ],
  imports: [MongooseModule.forFeature(forFeatureDb), CqrsModule],
})
export class BlogModule {}
