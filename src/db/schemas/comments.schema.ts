import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LikeStatus } from './post.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
  versionKey: false,
})
export class Comment {
  @Prop({
    type: String,
    required: true,
  })
  content: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  postId: string;

  @Prop({
    type: {
      userId: Types.ObjectId,
      userLogin: String,
    },
  })
  commentatorInfo: {
    userId: string;
    userLogin: string;
    _id: false, // To avoid creating a new ID for this subdocument
  };


  @Prop({ type: String })
  createdAt: string;

  @Prop({type:Number, default:0})
  likesCount: number;

  @Prop({type:Number, default:0})
  dislikesCount: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
