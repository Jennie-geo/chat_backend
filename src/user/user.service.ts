import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { defaultTo } from 'lodash';
import httpStatus from 'http-status';
import { ServiceResponseJson as serviceResponseJson } from '../Helpers/Response';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return {
        ...createUserDto,
      };
    } catch (error) {
      // this.logService.logError({ error }, this.logger)
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user, ${updateUserDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
