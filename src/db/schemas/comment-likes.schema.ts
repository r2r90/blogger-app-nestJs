import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LikeStatus } from './post-likes.schema';

export type CommentLikeDocument = HydratedDocument<CommentLike>;

@Schema({
  versionKey: false,
})
export class CommentLike {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Comment', required: true })
  commentId: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true, default: 'None' })
  likeStatus: LikeStatus;

  @Prop({ type: String, required: true })
  addedAt: string;
}

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);
