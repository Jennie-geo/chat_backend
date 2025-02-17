import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/entities/auth.entity';

export class Comment {
  @Prop()
  types: string; //emoji, message, comment

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  isDeleted: boolean;
}
