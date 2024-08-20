import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  versionKey: false,
})
export class User {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  createdAt: string;
  _id: any;

  @Prop({
    type: {
      confirmationCode: { type: String, default: null },
      expirationDate: { type: Date },
      isConfirmed: { type: Boolean, default: false },
    },
    required: true,
  })
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };

  @Prop({ type: String, default: null })
  recoveryCode: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
