import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDataDocument = HydratedDocument<SessionData>;

@Schema({
  versionKey: false,
})
export class SessionData {
  @Prop({
    type: String,
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
    required: true,
  })
  ip: string;

  @Prop({
    type: String,
    default: 'Unknown Browser',
  })
  title: string;

  @Prop({
    type: Date,
    required: true,
  })
  lastActiveDate: string;
}

export const SessionDataSchema = SchemaFactory.createForClass(SessionData);
