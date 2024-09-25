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

export const CommandHandlers = [CreateBlogHandler, CreatePostHandler];

@Module({
  controllers: [BlogController],
  providers: [
    BlogRepository,
    BlogQueryRepository,
    PostQueryRepository,
    PostRepository,
    ...CommandHandlers,
  ],
  imports: [MongooseModule.forFeature(forFeatureDb), CqrsModule],
})
export class BlogModule {}
