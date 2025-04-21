import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class Message {
  @Prop({ default: uuidv4 })
  _id: string;

  @Prop()
  uniqueId: string;

  @Prop()
  content: string;

  @Prop()
  type: string; //documents, image, video, text

  @Prop({ type: String })
  groupId: { type: mongoose.Schema.Types.ObjectId; ref: 'Group' }; //private and group

  @Prop({ type: String })
  senderId: { type: mongoose.Schema.Types.ObjectId; ref: 'User' };

  @Prop({ type: String })
  recipientId: { type: mongoose.Schema.Types.ObjectId; ref: 'User' };

  @Prop()
  isDeleted: boolean;

  @Prop()
  edited: boolean;

  @Prop()
  isRead: boolean;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  meta: Record<string, any>;

  @Prop({ type: Date, nullable: true })
  lastEdited: Date;

  createdAt: Date;

  updatedAt: Date;
}
export const GroupSchema = SchemaFactory.createForClass(Message);
