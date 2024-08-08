import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({
  versionKey: false,
})
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Blog', required: true })
  blogId: string;

  @Prop({ type: String })
  blogName: string;

  @Prop({ type: String })
  createdAt: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
