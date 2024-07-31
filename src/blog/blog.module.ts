import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from '../db/for-feature.db';
import { BlogRepository } from './repositories/blog.repository';

@Module({
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
  imports: [MongooseModule.forFeature(forFeatureDb)],
})
export class BlogModule {}
