import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeStatus, Post, PostLike } from '../../../db/db-mongo/schemas';
import { CreatePostDto } from '../dto/create.post.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PostQueryRepository } from './post-query.repository';
import { LikePostStatusInputDataType } from '../dto/like-status.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreatePostFromBlogDto } from '../dto/create.post.from.blog.dto';

export class PostRepository {
  constructor(
    @InjectDataSource() protected readonly db: DataSource,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(PostLike.name) private readonly postLikeModel: Model<PostLike>,
    private readonly postQueryRepository: PostQueryRepository,
  ) {}

  async update(id: string, data: CreatePostDto) {
    const res = await this.postModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (!res) throw new NotFoundException();
    return res;
  }

  async removePost(id: string) {
    const deletePostQuery = `
        DELETE
        FROM posts
        WHERE id = $1
    `;
    const res = await this.db.query(deletePostQuery, [id]);

    if (!res.rows) return null;
    return res;
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
    const { userId, postId, likeStatus } = data;

    const isAlreadyLiked = await this.postQueryRepository.userAlreadyLikedPost(
      postId,
      userId,
    );

    const likedUserData = {
      ...data,
      addedAt: new Date().toISOString(),
    };

    const createdAt = new Date().toISOString();

    if (isAlreadyLiked && isAlreadyLiked.like_status !== likeStatus) {
      await this.db.query(updateLikeQuery, [
        likeStatus,
        createdAt,
        postId,
        userId,
      ]);
    }

    if (!isAlreadyLiked && likedUserData.likeStatus !== LikeStatus.None) {
      await this.db.query(likeQuery, [postId, userId, likeStatus, createdAt]);
    }

    return null;
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
      throw new BadRequestException('No fields to update Post');
    }

    values.push(postId);

    const query = `
        UPDATE posts
        SET ${fields.join(', ')}
        WHERE id = $${index}`;

    try {
      const res = await this.db.query(query, values);
      return res.rows;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
