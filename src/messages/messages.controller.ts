import {
  Controller,
  // Get,
  // Post,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
// import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // @Post()
  // create(@Body() createMessageDto: CreateMessageDto) {
  //   return this.messagesService.createMessage(createMessageDto);
  // }

  // @Get()
  // findAll() {
  //   return this.messagesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.messagesService.findOneAndUpdate(+id);
  // }
}
