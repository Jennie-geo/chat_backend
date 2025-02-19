import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  // @Prop({ required: true })
  @Prop()
  firstName: string;

  @Prop()
  middleName: string;

  // @Prop({ required: true })
  @Prop()
  lastName: string;

  @Prop()
  userName: string;

  // @Prop({ required: true })
  @Prop()
  email: string;

  // @Prop({ required: true })
  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  status: string;

  @Prop()
  mobile: string;

  @Prop()
  isActive: boolean;

  @Prop()
  isDisabled: boolean;

  @Prop()
  isDeleted: boolean;

  @Prop()
  lastLogin: Date;
}

import { SchemaFactory } from '@nestjs/mongoose';
export const UserSchema = SchemaFactory.createForClass(User);
