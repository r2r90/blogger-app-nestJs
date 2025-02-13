import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './repositories/comment.repository';
import { CommentMapper } from './mapper/comment.mapper';
import { JwtService } from '@nestjs/jwt';
import { CommentQueryRepository } from './repositories/comment.query.repository';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { CommentLike } from './entity/comment-likes.entity';

@Module({
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentRepository,
    CommentQueryRepository,
    CommentMapper,
    JwtService,
  ],
  imports: [UserModule, TypeOrmModule.forFeature([Comment, CommentLike])],
  exports: [CommentRepository, CommentMapper, CommentQueryRepository],
})
export class CommentModule {}
