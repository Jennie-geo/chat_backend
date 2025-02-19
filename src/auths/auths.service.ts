import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/sigup-auth.dto';
import * as bcrypt from 'bcrypt';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { defaultTo } from 'lodash';
import httpStatus from 'http-status';
import { ServiceResponseJson as serviceResponseJson } from '../Helpers/Response';

@Injectable()
export class AuthsService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async create(createAuthDto: CreateAuthDto) {
    try {
      const { email, password } = createAuthDto;
      const existingEmail = await this.userModel.findOne({ email });
      if (existingEmail) {
        throw new HttpException(
          'User with this email already exist',
          HttpStatus.OK,
        );
      }
      const salt = await bcrypt.genSalt(8);
      const hashPassword = await bcrypt.hash(password, salt);
      const user = await this.userModel.create({
        email,
        password: hashPassword,
      });
      return {
        ...serviceResponseJson,
        statusCode: httpStatus.CREATED,
        status: true,
        message: 'User created successfully',
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

  login() {}

  logout() {}
}
