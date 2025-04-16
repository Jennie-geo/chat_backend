import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Message } from './entities/message.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceResponseJson as serviceResponseJson } from '../Helpers/Response';
import { defaultTo, isNil } from 'lodash';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DateTime } from 'luxon';
import httpStatus from 'http-status';

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

  async editMessage(senderId: string, dto: UpdateMessageDto) {
    const existingMessage = await this.messageModel
      .findOne({
        uniqueId: dto.uniqueId,
        isDeleted: false,
      })
      .exec();

    if (isNil(existingMessage)) {
      throw new NotFoundException('message not found');
    }
    if (existingMessage.senderId.toString() !== senderId.toString()) {
      throw new ForbiddenException('can not edit this message');
    }

    existingMessage.content = dto.content;
    existingMessage.edited = true;
    existingMessage.lastEdited = DateTime.now().toJSDate();
    await existingMessage.save();

    return existingMessage;
  }

  async deleteMessage(senderId: string, dto: UpdateMessageDto) {
    const message = await this.messageModel
      .findOne({ uniqueId: dto.uniqueId, isDeleted: false })
      .exec();

    if (isNil(message)) {
      throw new NotFoundException('message not found');
    }
    if (message.senderId.toString() !== senderId.toString()) {
      throw new ForbiddenException('can not edit this message');
    }
    //set deletion time phase
    message.isDeleted = true;
    await message.save();

    return message;
  }

  async recipientDeleteMessage(id: string, request: any) {
    try {
      const { recipientId } = request.user;
      const message = await this.messageModel
        .findOne({ uniqueId: id, isDeleted: false, recipientId })
        .exec();

      if (isNil(message)) {
        throw new NotFoundException('message not found');
      }
      //set time
      if (message.recipientId.toString() !== recipientId.toString()) {
        throw new ForbiddenException('can not delete this message');
      }
      message.isDeleted = true;
      await message.save();

      return {
        ...serviceResponseJson,
        statusCode: HttpStatus.OK,
        status: true,
        message: 'message deleted successfully',
        data: null,
      };
    } catch (error) {
      const statusCode =
        defaultTo(
          error?.response?.statusCode,
          defaultTo(error?.response?.status, error?.status),
        ) ?? httpStatus.INTERNAL_SERVER_ERROR;
      return {
        ...serviceResponseJson,
        status: false,
        statusCode:
          statusCode === httpStatus.UNAUTHORIZED
            ? httpStatus.BAD_REQUEST
            : statusCode,
        message:
          error?.response?.data?.message ??
          error?.message ??
          'an error has occurred. kindly try again later.',
      };
    }
  }
}
