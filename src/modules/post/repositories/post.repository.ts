import { CreatePostDataType, CreatePostDto } from '../dto/create.post.dto';
import { PostQueryRepository } from './post-query.repository';
import { LikePostStatusInputDataType } from '../dto/like-status.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePostFromBlogDto } from '../dto/create.post.from.blog.dto';
import { IPostLike } from '../entity/post-likes.entity';
import { LikeStatus } from '../../../db/db-mongo/schemas';
import { Post } from '../entity/post.entity';
import { PostMapper } from '../mapper/post.mapper';
import { BadRequestException } from '@nestjs/common';

export class PostRepository {
  constructor(
    @InjectDataSource() protected readonly db: DataSource,
    @InjectRepository(Post)
    protected readonly postsRepository: Repository<Post>,
    private readonly postQueryRepository: PostQueryRepository,
    private readonly postMapper: PostMapper,
  ) {}

  async createPost(createPostData: CreatePostDataType) {
    const { title, blogId, content, shortDescription } = createPostData;

    const post = this.postsRepository.create({
      title,
      short_description: shortDescription,
      content,
      blog_id: blogId,
    });

    const savedPost = await this.postsRepository.save(post);

    const postWithBlog = await this.postsRepository.findOne({
      where: { id: savedPost.id },
      relations: ['blog'],
    });

    return await this.postMapper.mapPost(postWithBlog);
  }

  async update(id: string, data: CreatePostDto) {
    // const res = await this.postsRepository.findOneBy({ _id: id }, data, {
    //   new: true,
    // });
    // if (!res) throw new NotFoundException();
    // return res;
  }

  async removePost(id: string) {
    return await this.postsRepository.delete(id);
  }

  async updatePost(postId: string, updateData: CreatePostFromBlogDto) {
    const { title, shortDescription, content } = updateData;
    const updatePost = await this.postsRepository
      .update(
        { id: postId },
        {
          title,
          short_description: shortDescription,
          content,
        },
      )
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return !!updatePost;
  }

  async likePost(data: LikePostStatusInputDataType): Promise<any> {
    const likeQuery = `
        INSERT INTO post_likes (post_id, user_id, like_status, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const updateLikeQuery = `
        UPDATE post_likes
        SET like_status = $1,
            created_at  = $2
        WHERE post_id = $3
          AND user_id = $4
    `;

    const deleteLikeQuery = `
        DELETE
        FROM post_likes
        WHERE user_id = $1
          AND post_id = $2;
    `;
    const { userId, postId, likeStatus } = data;

    const isAlreadyLiked: IPostLike =
      await this.postQueryRepository.userAlreadyLikedPost(postId, userId);

    const createdAt = new Date().toISOString();

    if (likeStatus === LikeStatus.None) {
      if (!isAlreadyLiked) return null;
      await this.db.query(deleteLikeQuery, [userId, postId]);
    }

    if (isAlreadyLiked && isAlreadyLiked.like_status !== likeStatus) {
      await this.db.query(updateLikeQuery, [
        likeStatus,
        createdAt,
        postId,
        userId,
      ]);
    }

    if (!isAlreadyLiked && likeStatus !== LikeStatus.None) {
      await this.db.query(likeQuery, [postId, userId, likeStatus, createdAt]);
    }

    return null;
  }
}
