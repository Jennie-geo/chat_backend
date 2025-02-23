import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  HttpException,
} from '@nestjs/common';
import { AuthsService } from './auths.service';
import { CreateAuthDto } from './dto/sigup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';
import { includes, toString } from 'lodash';
import {
  ResponseJson as responseJson,
  ServiceResponseStatusErrorArray,
} from 'src/Helpers/Response';
import { Response } from 'express';
@Controller('auth')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('signup')
  async signup(
    @Body() createAuthDto: CreateAuthDto,
    @Res() response: Response,
  ) {
    const { status, message, statusCode, data } =
      await this.authsService.create(createAuthDto);
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

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res() response: Response) {
    const { status, message, statusCode, data } =
      await this.authsService.login(loginAuthDto);
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
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Request() request: Request, @Res() response: Response) {
    const { status, message, statusCode, data } =
      await this.authsService.logout(request);

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
