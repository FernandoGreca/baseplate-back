import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_: any, ret: any) => {
      ret.user_id = ret._id;
      delete ret._id;
      delete ret.id;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  first_name: string;

  @Prop()
  last_name?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  constructor(init: Partial<User>) {
    Object.assign(this, init);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
