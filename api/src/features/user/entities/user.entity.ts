import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;
@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  constructor(init: Partial<User>) {
    Object.assign(this, init);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
