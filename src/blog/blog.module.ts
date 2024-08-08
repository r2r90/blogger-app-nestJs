import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../db/for-feature.db';
import { BlogRepository } from './repositories/blog.repository';
import { BlogQueryRepository } from './repositories/blog.query.repository';
import { PostService } from '../post/post.service';
import { PostRepository } from '../post/repositories/post.repository';
import { PostQueryRepository } from '../post/repositories/post.query.repository';

@Module({
  controllers: [BlogController],
  providers: [
    BlogService,
    BlogRepository,
    BlogQueryRepository,
    PostService,
    PostQueryRepository,
    PostRepository,
  ],
  imports: [MongooseModule.forFeature(forFeatureDb)],
})
export class BlogModule {}
