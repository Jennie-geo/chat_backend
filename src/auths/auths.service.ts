import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/sigup-auth.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { defaultTo, isNil } from 'lodash';
import httpStatus from 'http-status';
import { ServiceResponseJson as serviceResponseJson } from '../Helpers/Response';
import { LoginAuthDto } from './dto/login-auth.dto';
// import { UtilsConfig } from 'src/Utils/generatePasswordToken';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';

@Injectable()
export class AuthsService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
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

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const { email, password } = loginAuthDto;

      const user = await this.userModel.findOne({ email });
      if (isNil(user)) {
        throw new HttpException('Oops! user not found', HttpStatus.BAD_REQUEST);
      }
      const isPasswordValid = await bcrypt.compare(password!, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException();
      }
      const payload = { sub: user._id, email: user.email };

      const accessToken = this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: jwtConstants.expiresIn,
      });
      user.lastLogin = user.updatedAt;
      await user.save();
      return {
        ...serviceResponseJson,
        statusCode: httpStatus.OK,
        status: true,
        message: 'Logged in successfully',
        data: null,
        access_token: accessToken,
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

  public async logout(req: any) {
    try {
      return {
        ...serviceResponseJson,
        statusCode: httpStatus.OK,
        status: true,
        message: 'You have successfully logged out.',
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
