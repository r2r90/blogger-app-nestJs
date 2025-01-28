import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../../db/db-mongo/for-feature.db';
import { BlogRepository } from './repositories/blog.repository';
import { BlogQueryRepository } from './repositories/blog.query.repository';
import { PostRepository } from '../post/repositories/post.repository';
import { PostQueryRepository } from '../post/repositories/post-query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogHandler } from './commands/handlers/create-blog.handler';
import { CreatePostHandler } from '../post/commands/handlers/create-post.handler';
import { BlogService } from './blog.service';
import { JwtService } from '@nestjs/jwt';
import { CommentMapper } from '../comment/mapper/comment.mapper';
import { CommentRepository } from '../comment/repositories/comment.repository';
import { SuperAdminBlogController } from './blog.sa.controller';
import { PostService } from '../post/post.service';
import { CommentQueryRepository } from '../comment/repositories/comment.query.repository';
import { PostMapper } from '../post/mapper/post.mapper';
import { UserModule } from '../user/user.module';

export const CommandHandlers = [CreateBlogHandler, CreatePostHandler];

@Module({
  controllers: [SuperAdminBlogController, BlogController],
  providers: [
    BlogRepository,
    BlogQueryRepository,
    PostQueryRepository,
    PostRepository,
    BlogService,
    PostService,
    PostMapper,
    JwtService,
    CommentMapper,
    CommentRepository,
    CommentQueryRepository,
    ...CommandHandlers,
  ],
  imports: [MongooseModule.forFeature(forFeatureDb), CqrsModule, UserModule],
})
export class BlogModule {}
