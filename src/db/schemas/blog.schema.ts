import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Post } from './post.schema';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({
  versionKey: false,
})
export class Blog {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: String,
    required: true,
  })
  websiteUrl: string;

  @Prop({ type: String })
  createdAt: string;

  @Prop({ default: false })
  isMembership: boolean;

  @Prop({ type: [Types.ObjectId], ref: Post.name, required: false })
  posts: Post[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
