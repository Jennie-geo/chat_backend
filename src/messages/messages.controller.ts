import {
  Controller,
  Delete,
  HttpException,
  Param,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from 'src/auths/auth.guard';
import {
  ServiceResponseStatusErrorArray,
  ResponseJson as responseJson,
} from 'src/Helpers/Response';
import { includes, toString } from 'lodash';
import { Response } from 'express';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteMessage(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const { status, message, statusCode, data } =
      await this.messagesService.recipientDeleteMessage(id, request);

    if (includes(ServiceResponseStatusErrorArray, toString(status))) {
      throw new HttpException(message, statusCode);
    }

    return response.send({
      ...responseJson,
      status: statusCode,
      message,
      data,
    });
  }
}
