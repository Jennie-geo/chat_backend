import { Prop, Schema } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
@Schema({ timestamps: true })
export class User {
  @Prop({ default: uuidv4 })
  _id: string;

  @Prop()
  userName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  status: string;

  @Prop()
  mobile: string;

  // @Prop()
  // isActive: boolean;

  @Prop()
  isDisabled: boolean;

  @Prop()
  isDeleted: boolean;

  @Prop()
  lastLogin: Date;

  createdAt: Date;

  updatedAt: Date;
}

import { SchemaFactory } from '@nestjs/mongoose';
export const UserSchema = SchemaFactory.createForClass(User);
