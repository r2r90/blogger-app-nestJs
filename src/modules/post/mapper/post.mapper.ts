import { PostWithBlogName } from '../entity/post.entity';
import { LikeStatus } from '../../../db/db-mongo/schemas';

export type NewestLikes = {
  addedAt: string;
  userId: string;
  login: string;
};

export type PostLikesInfo = {
  user_id: string;
  post_id: string;
  login: string;
  like_status: LikeStatus;
  created_at: string;
};

export type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: 'None' | 'Like' | 'Dislike';
  newestLikes: NewestLikes[];
};

export type PostOutputType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;
};

export class PostMapper {
  public async mapPost(
    post: PostWithBlogName,
    postLikesInfo: PostLikesInfo[],
    userId?: string,
  ): Promise<PostOutputType> {
    const myStatus: LikeStatus =
      !userId || postLikesInfo.length === 0
        ? LikeStatus.None
        : (postLikesInfo.find((like) => like.user_id === userId)
            ?.like_status as LikeStatus) || LikeStatus.None;

    const newestLikes: NewestLikes[] = postLikesInfo
      .filter((like) => like.like_status === LikeStatus.Like)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 3)
      .map((like) => ({
        addedAt: like.created_at,
        userId: like.user_id,
        login: like.login,
      }));

    return {
      id: post.id,
      title: post.title,
      shortDescription: post.short_description,
      content: post.content,
      createdAt: post.created_at,
      blogName: post.blog_name,
      blogId: post.blog_id,
      extendedLikesInfo: {
        likesCount: postLikesInfo.filter(
          (like) =>
            like.like_status === LikeStatus.Like && like.post_id === post.id,
        ).length,
        dislikesCount: postLikesInfo.filter(
          (like) =>
            like.like_status === LikeStatus.Dislike && like.post_id === post.id,
        ).length,
        myStatus,
        newestLikes,
      },
    };
  }
}
