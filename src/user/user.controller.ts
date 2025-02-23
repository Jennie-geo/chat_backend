import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  HttpException,
  Res,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auths/auth.guard';
import {
  ResponseJson as responseJson,
  ServiceResponseStatusErrorArray,
} from 'src/Helpers/Response';
import { includes, toString } from 'lodash';
import { Response } from 'express';

@Controller('users/')
export class UsersController {
  constructor(private readonly authsService: UsersService) {}
  @UseGuards(AuthGuard)
  @Patch('profile/update')
  async updateUserInfo(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: Request,
    @Res() response: Response,
  ) {
    const { status, message, statusCode, data } =
      await this.authsService.updateUserInfo(updateUserDto, req);
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
  @Patch('profile/status')
  async updateStatus(
    @Request() request: Request,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    const { status, message, statusCode, data } =
      await this.authsService.updateUserStatus(request, updateUserDto);

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

  @Get()
  findAll() {
    return this.authsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authsService.remove(+id);
  }
}
