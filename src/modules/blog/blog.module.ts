import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogRepository } from './repositories/blog.repository';
import { BlogQueryRepository } from './repositories/blog.query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogHandler } from './commands/handlers/create-blog.handler';
import { CreatePostHandler } from '../post/commands/handlers/create-post.handler';
import { BlogService } from './blog.service';
import { JwtService } from '@nestjs/jwt';
import { SuperAdminBlogController } from './blog.sa.controller';
import { PostMapper } from '../post/mapper/post.mapper';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entity/blog.entity';
import { PostModule } from '../post/post.module';
import { PostLike } from '../post/entity/post-likes.entity';
import { Post } from '../post/entity/post.entity';
import { CommentModule } from '../comment/comment.module';

export const CommandHandlers = [CreateBlogHandler, CreatePostHandler];

@Module({
  controllers: [SuperAdminBlogController, BlogController],
  providers: [
    BlogRepository,
    BlogQueryRepository,
    BlogService,
    PostMapper,
    JwtService,
    ...CommandHandlers,
  ],
  imports: [
    TypeOrmModule.forFeature([Blog, PostLike, Post]),
    CqrsModule,
    UserModule,
    PostModule,
    BlogModule,
    CommentModule,
  ],
  exports: [BlogService, BlogRepository, BlogQueryRepository],
})
export class BlogModule {}
