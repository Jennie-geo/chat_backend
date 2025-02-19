import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Group {
  @Prop()
  name: string;

  @Prop()
  type: string; //chat and channel

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  members: User[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop()
  isActive: boolean;

  @Prop()
  isDisabled: boolean;

  @Prop()
  isDeleted: boolean;
}
