import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  CreateCommentDataType,
  CreateCommentDto,
} from '../dto/create-comment.dto';
import { CommentMapper, CommentOutputType } from '../mapper/comment.mapper';
import { LikeCommentStatusInputDataType } from '../../post/dto/like-status.dto';
import { Comment, CommentLike, LikeStatus } from '../../../db/db-mongo/schemas';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(CommentLike.name)
    private readonly commentLikeModel: Model<CommentLike>,
    private readonly commentMapper: CommentMapper,
  ) {}

  async createComment(createCommentData: CreateCommentDataType) {
    const createdAt = new Date().toISOString();
    const createdComment = new this.commentModel({
      ...createCommentData,
      createdAt,
      commentatorInfo: {
        userId: createCommentData.userId,
        userLogin: createCommentData.userLogin,
      },
    });

    const savedComment = await createdComment.save();
    return {
      id: createdComment._id,
      content: savedComment.content,
      createdAt: savedComment.createdAt,
      commentatorInfo: {
        userId: createCommentData.userId,
        userLogin: createCommentData.userLogin,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
  }

  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentOutputType> {
    const comment = await this.commentModel.findById(commentId);
    const likeInfo = await this.getLikesByCommentId(commentId);
    if (!comment)
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    return this.commentMapper.mapComments(comment, likeInfo, userId);
  }

  async update(id: string, data: CreateCommentDto) {
    const res = await this.commentModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    if (!res) throw new NotFoundException();
    return res;
  }

  async remove(id: string) {
    const comment = await this.getCommentById(id);
    if (!comment) throw new NotFoundException();
    const res = await this.commentModel.findByIdAndDelete(id);
    if (!res) return null;
    return res;
  }

  getLikesByCommentId(commentId: string): Promise<CommentLike[]> {
    return this.commentLikeModel.find({ commentId }).lean();
  }

  async likeComment(data: LikeCommentStatusInputDataType): Promise<any> {
    const { userId, commentId, likeStatus } = data;
    const isAlreadyLiked = await this.userAlreadyLikedComment(
      commentId,
      userId,
    );

    const likedUserData = {
      ...data,
      addedAt: new Date().toISOString(),
    };

    if (isAlreadyLiked && isAlreadyLiked.likeStatus !== likeStatus) {
      await this.commentLikeModel.updateOne(
        { _id: isAlreadyLiked.id },
        { likeStatus: likeStatus, addedAt: new Date().toISOString() },
        { new: true },
      );
    }

    if (!isAlreadyLiked && likedUserData.likeStatus !== LikeStatus.None) {
      await this.commentLikeModel.create(likedUserData);
    }

    return null;
  }

  async userAlreadyLikedComment(commentId: string, userId: string) {
    const user = await this.commentLikeModel.findOne({ commentId, userId });
    if (!user) return null;
    return user;
  }
}
