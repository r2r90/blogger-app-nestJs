import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../../db/schemas/comments.schema';
import { CreateCommentDataType } from '../dto/create-comment.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
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
      postId: savedComment.postId,
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
}
