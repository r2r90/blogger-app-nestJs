import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Blog {
  @Prop()
  name: string;
  @Prop()
  roleNumber: number;
  @Prop()
  class: number;
  @Prop()
  gender: string;
  @Prop()
  marks: number;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
