import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,
})
export class Blog {
  @Prop({
    type: String,
    unique: true,
  })
  id: ObjectId;

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

  @Prop()
  createdAt: string;

  @Prop()
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
