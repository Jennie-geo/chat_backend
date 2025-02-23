import {
  HttpException,
  // HttpException,
  Injectable,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { defaultTo, isEmpty, isNil } from 'lodash';
import httpStatus from 'http-status';
import { ServiceResponseJson as serviceResponseJson } from '../Helpers/Response';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async updateUserInfo(updateUserDto: UpdateUserDto, @Request() req: any) {
    try {
      const { sub: _id } = req.user;
      const user = await this.userModel.findById(_id).select('-password');
      if (isNil(user)) {
        throw new UnauthorizedException();
      }
      user.isDeleted = false;
      user.isDisabled = false;
      Object.assign(user, updateUserDto);
      await user.save();
      return {
        ...serviceResponseJson,
        statusCode: httpStatus.OK,
        status: true,
        message: 'user profile updated successfully',
        data: user,
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async updateUserStatus(auth: any, updateUserDto: UpdateUserDto) {
    try {
      console.log(auth.user);
      const { sub: _id } = auth.user;
      const { status } = updateUserDto;
      const user = await this.userModel.findById(_id); //.select('-password');
      if (isNil(user)) {
        throw new UnauthorizedException();
      }

      if (isNil(status) || isEmpty(status)) {
        throw new HttpException(
          'status cannot be empty',
          httpStatus.BAD_REQUEST,
        );
      }
      user.status = status;
      await user.save();

      return {
        ...serviceResponseJson,
        statusCode: httpStatus.OK,
        status: true,
        message: 'user status updated successfully',
        data: user.status,
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
