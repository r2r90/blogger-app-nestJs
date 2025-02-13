import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from '../entity/post-likes.entity';
import { Repository } from 'typeorm';
import { LikeStatus } from '../dto/like-status.dto';

export type NewestLikesOutput = {
  userId: string;
  login: string;
  addedAt: Date;
};

export type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: 'None' | 'Like' | 'Dislike';
  newestLikes: NewestLikesOutput[];
};

export type PostOutputType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: ExtendedLikesInfo;
};

export class PostMapper {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
  ) {}

  public async mapPost(post, userId?: string): Promise<PostOutputType> {
    const myStatus: LikeStatus =
      !userId || post.postLikes.length === 0
        ? LikeStatus.None
        : (post.postLikes.find((like) => like.user_id === userId)
            ?.like_status as LikeStatus) || LikeStatus.None;

    const newestLikes: NewestLikesOutput[] = post.postLikes
      .filter((like) => like.like_status === LikeStatus.Like)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 3)
      .map((like) => ({
        addedAt: like.created_at,
        userId: like.user_id,
        login: like.user.login,
      }));

    return {
      id: post.id,
      title: post.title,
      shortDescription: post.short_description,
      content: post.content,
      createdAt: post.created_at,
      blogName: post.blog.name,
      blogId: post.blog.id,
      extendedLikesInfo: {
        likesCount: post.postLikes.filter(
          (like) =>
            like.like_status === LikeStatus.Like && like.post_id === post.id,
        ).length,
        dislikesCount: post.postLikes.filter(
          (like) =>
            like.like_status === LikeStatus.Dislike && like.post_id === post.id,
        ).length,
        myStatus,
        newestLikes,
      },
    };
  }
}
