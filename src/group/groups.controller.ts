import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Res,
  HttpException,
  Req,
  RawBodyRequest,
  Query,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AuthGuard } from 'src/auths/auth.guard';
import { Response } from 'express';
import { includes, toString } from 'lodash';
import {
  ServiceResponseStatusErrorArray,
  ResponseJson as responseJson,
} from 'src/Helpers/Response';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly groupsService: GroupsService) {}
  @UseGuards(AuthGuard)
  @Post('group')
  async create(
    @Body() createChannelDto: CreateGroupDto,
    @Request() request: Request,
    @Res() response: Response,
  ) {
    const { status, message, statusCode, data } =
      await this.groupsService.createGroup(createChannelDto, request);

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
  @Post(':_id')
  async addGroupMember(
    @Param('_id') _id: string,
    @Req() request: RawBodyRequest<Request>,
    @Res() response: Response,
  ) {
    const { status, message, statusCode, data } =
      await this.groupsService.addGroupMember(_id, request);

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
  @Get(':_id')
  async groupMembers(@Param('_id') _id: string, @Res() response: Response) {
    const { status, message, statusCode, data } =
      await this.groupsService.retrieveGroupMembers(_id);

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

  @Get('group/search')
  async SearchGroup(@Query('name') query: string, @Res() response: Response) {
    const { status, message, statusCode, data } =
      await this.groupsService.searchForGroup(query);

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
