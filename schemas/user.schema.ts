import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  // This field is used to store references to valid refresh tokens (via JWT payload).
  // Changing it will invalidate all previously issued refresh tokens,
  // which is useful in cases where a refresh token has been stolen.
  @Prop({ required: true, default: uuidv4 })
  refreshTokenRef: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
