import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Message {
  @Prop()
  content: string;

  @Prop()
  type: string; //documents, image, video, text

  @Prop()
  groupId: string; //chat and channel

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  recipient: User;

  @Prop()
  isDeleted: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  comment: Comment;

  @Prop()
  isRead: boolean;

  @Prop()
  meta: object;
}
