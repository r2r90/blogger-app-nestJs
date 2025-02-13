import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { Session } from '../security-devices/entity/session.entity';
import { Post } from '../post/entity/post.entity';
import { PostLike } from '../post/entity/post-likes.entity';
import { Comment } from '../comment/entity/comment.entity';
import { CommentLike } from '../comment/entity/comment-likes.entity';
import { Blog } from '../blog/entity/blog.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    protected readonly usersRepository: Repository<User>,
    @InjectRepository(Session)
    protected readonly sessionRepository: Repository<Session>,
    @InjectRepository(Blog)
    protected readonly blogsDataRepository: Repository<Blog>,
    @InjectRepository(Post)
    protected readonly postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    protected readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(Comment)
    protected readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    protected readonly commentLikeRepository: Repository<CommentLike>,
  ) {}

  getHello(): string {
    return 'Hello World! ';
  }

  async deleteAllData() {
    await this.usersRepository.delete({});
    await this.sessionRepository.delete({});
    await this.blogsDataRepository.delete({});
    await this.postRepository.delete({});
    await this.postLikeRepository.delete({});
    await this.commentRepository.delete({});
    await this.commentLikeRepository.delete({});
  }
}
