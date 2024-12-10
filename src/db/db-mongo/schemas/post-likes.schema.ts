import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostLikeDocument = HydratedDocument<PostLike>;

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

@Schema({
  versionKey: false,
})
export class PostLike {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true, default: 'None' })
  likeStatus: LikeStatus;

  @Prop({ type: String, required: true })
  addedAt: string;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);
