import { LikeStatus } from '../dto/like-status.dto';
import { PostLike } from '../entity/post-likes.entity';

export type NewestLikesOutput = {
  userId: string;
  login: string;
  addedAt: Date;
};

interface PostWithBlog {
  id: string;
  title: string;
  short_description: string;
  content: string;
  created_at: Date;
  blog_id: string;
  blog: { id: string; name: string };
  post_likes: PostLike[];
}

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
  public async mapPost(
    post: PostWithBlog,
    userId?: string,
  ): Promise<PostOutputType> {
    const myStatus: LikeStatus =
      !userId || !post.post_likes
        ? LikeStatus.None
        : (post.post_likes.find((like: PostLike) => like.user_id === userId)
            ?.like_status as LikeStatus) || LikeStatus.None;

    const newestLikes: NewestLikesOutput[] = post.post_likes
      .filter((like: PostLike) => like.like_status === LikeStatus.Like)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 3)
      .map((like: PostLike) => ({
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
        likesCount: post.post_likes.filter(
          (like: PostLike) =>
            like.like_status === LikeStatus.Like && like.post_id === post.id,
        ).length,
        dislikesCount: post.post_likes.filter(
          (like: PostLike) =>
            like.like_status === LikeStatus.Dislike && like.post_id === post.id,
        ).length,
        myStatus,
        newestLikes,
      },
    };
  }
}
