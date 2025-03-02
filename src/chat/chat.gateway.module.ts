import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagesService } from 'src/messages/messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, GroupSchema } from 'src/messages/entities/message.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: GroupSchema }]), // Register the model
  ],
  controllers: [],
  providers: [ChatGateway, MessagesService],
})
export class EventModule {}
