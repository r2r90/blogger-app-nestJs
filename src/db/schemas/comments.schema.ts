import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

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
      userId: { type: Types.ObjectId, required: true },
      userLogin: { type: String, required: true },
    },
  })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  @Prop({ type: String })
  createdAt: string;

  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  dislikesCount: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
