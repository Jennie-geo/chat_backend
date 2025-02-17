import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  middleName: string;

  @Prop()
  lastName: string;

  @Prop()
  userName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
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
