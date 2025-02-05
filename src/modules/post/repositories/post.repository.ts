import { CreatePostDataType, CreatePostDto } from '../dto/create.post.dto';
import { BadRequestException } from '@nestjs/common';
import { PostQueryRepository } from './post-query.repository';
import { LikePostStatusInputDataType } from '../dto/like-status.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePostFromBlogDto } from '../dto/create.post.from.blog.dto';
import { IPostLike } from '../entity/post-likes.entity';
import { LikeStatus } from '../../../db/db-mongo/schemas';
import { Post } from '../entity/post.entity';
import { PostMapper } from '../mapper/post.mapper';

export class PostRepository {
  constructor(
    @InjectDataSource() protected readonly db: DataSource,
    @InjectRepository(Post)
    protected readonly postsRepository: Repository<Post>,
    private readonly postQueryRepository: PostQueryRepository,
    private readonly postMapper: PostMapper,
  ) {}

  async createPost(createPostData: CreatePostDataType) {
    const { title, blogId, content, shortDescription, blogName } =
      createPostData;

    const post = this.postsRepository.create({
      title,
      short_description: shortDescription,
      content,
      blog_id: blogId,
      blog_name: blogName,
    });

    const savedPost = await this.postsRepository.save(post);

    return await this.postMapper.mapPost(savedPost);
  }

  async update(id: string, data: CreatePostDto) {
    // const res = await this.postsRepository.findOneBy({ _id: id }, data, {
    //   new: true,
    // });
    // if (!res) throw new NotFoundException();
    // return res;
  }

  async removePost(id: string) {
    const deletePostQuery = `
        DELETE
        FROM posts
        WHERE post_id = $1
    `;
    const res = await this.db.query(deletePostQuery, [id]);

    if (!res.rows) return null;
    return res;
  }

  async updatePost(postId: string, updateData: CreatePostFromBlogDto) {
    const { title, shortDescription, content } = updateData;
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (title) {
      fields.push(`title = $${index++}`);
      values.push(title);
    }
    if (shortDescription) {
      fields.push(`short_description = $${index++}`);
      values.push(shortDescription);
    }
    if (content) {
      fields.push(`content = $${index++}`);
      values.push(content);
    }

    if (fields.length === 0) {
      throw new BadRequestException('No fields to update PostInterface');
    }

    values.push(postId);

    const query = `
        UPDATE posts
        SET ${fields.join(', ')}
        WHERE post_id = $${index}`;

    try {
      const res = await this.db.query(query, values);
      return res.rows;
    } catch (e) {
      throw new BadRequestException(e);
    }
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
