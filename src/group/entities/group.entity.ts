import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import { User } from 'src/user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Group {
  @Prop({ default: uuidv4 })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  type: string; //chat and group

  @Prop({ type: [{ type: String }] })
  // members: User[];
  members: [{ type: mongoose.Schema.Types.ObjectId; ref: 'User' }];

  @Prop({ type: String })
  createdBy: { type: mongoose.Schema.Types.ObjectId; ref: 'User' };

  @Prop()
  isActive: boolean;

  @Prop()
  isDisabled: boolean;

  @Prop()
  uniqueId: string;

  @Prop()
  isDeleted: boolean;

  createdAt: Date;

  updatedAt: Date;
}
export const GroupSchema = SchemaFactory.createForClass(Group);
