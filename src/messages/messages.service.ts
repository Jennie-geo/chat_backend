import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceResponseJson as serviceResponseJson } from '../Helpers/Response';
import { defaultTo } from 'lodash';

@Injectable()
export class MessagesService {
  constructor(@InjectModel('Message') private messageModel: Model<Message>) {}
  async createMessage(data: {
    recipientId: string;
    senderId: string;
    message: string;
  }) {
    try {
      const savedMessage = await this.messageModel.create({
        recipientId: data.recipientId,
        content: data.message,
        senderId: data.senderId,
        isDeleted: false,
        isRead: false,
      });
      return {
        ...serviceResponseJson,
        statusCode: HttpStatus.CREATED,
        status: true,
        message: savedMessage,
        data: null,
      };
    } catch (error) {
      const statusCode =
        defaultTo(
          error?.response?.statusCode,
          defaultTo(error?.response?.status, error?.status),
        ) ?? HttpStatus.INTERNAL_SERVER_ERROR;
      return {
        ...serviceResponseJson,
        status: false,
        statusCode:
          statusCode === HttpStatus.UNAUTHORIZED
            ? HttpStatus.BAD_REQUEST
            : statusCode,
        message:
          error?.response?.data?.message ??
          error?.message ??
          'an error has occurred. kindly try again later.',
      };
    }
  }

  async getMessageBetweenUser(firstUser: string, secondUser: string) {
    try {
      const userMessage = await this.messageModel
        .find({
          $or: [
            { sender: firstUser, reciever: secondUser },
            { reciever: firstUser, sender: secondUser },
          ],
        })
        .sort({ createdAt: -1 })
        .exec();
      console.log('message', userMessage);
      if (userMessage.length < 1) {
        throw new HttpException('No message found', HttpStatus.OK);
      }
      return {
        ...serviceResponseJson,
        statusCode: HttpStatus.CREATED,
        status: true,
        message: 'message received.',
        data: userMessage,
      };
    } catch (error) {
      const statusCode =
        defaultTo(
          error?.response?.statusCode,
          defaultTo(error?.response?.status, error?.status),
        ) ?? HttpStatus.INTERNAL_SERVER_ERROR;
      return {
        ...serviceResponseJson,
        status: false,
        statusCode:
          statusCode === HttpStatus.UNAUTHORIZED
            ? HttpStatus.BAD_REQUEST
            : statusCode,
        message:
          error?.response?.data?.message ??
          error?.message ??
          'an error has occurred. kindly try again later.',
      };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
