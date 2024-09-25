import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../db/for-feature.db';
import { PostController } from './post.controller';
import { PostRepository } from './repositories/post.repository';
import { BlogQueryRepository } from '../blog/repositories/blog.query.repository';
import { PostQueryRepository } from './repositories/post-query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostHandler } from './commands/handlers/create-post.handler';
import { BlogRepository } from '../blog/repositories/blog.repository';

export const CommandHandlers = [CreatePostHandler];

@Module({
  controllers: [PostController],
  providers: [
    PostRepository,
    PostQueryRepository,
    BlogQueryRepository,
    BlogRepository,
    ...CommandHandlers,
  ],
  imports: [MongooseModule.forFeature(forFeatureDb), CqrsModule],
})
export class PostModule {}
