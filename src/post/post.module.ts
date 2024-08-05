import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../db/for-feature.db';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './repositories/post.repository';
import { BlogQueryRepository } from '../blog/repositories/blog.query.repository';
import { PostQueryRepository } from './repositories/post.query.repository';

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    PostQueryRepository,
    BlogQueryRepository,
  ],
  imports: [MongooseModule.forFeature(forFeatureDb)],
})
export class PostModule {}
