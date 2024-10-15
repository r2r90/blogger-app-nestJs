import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema({
  versionKey: false,
})
export class Token {
  @Prop({
    type: String,
    required: true,
  })
  refreshToken: string;

  @Prop({
    type: Date,
    required: true,
  })
  expiresAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  userId: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
