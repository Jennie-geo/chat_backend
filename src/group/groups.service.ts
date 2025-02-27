import { HttpException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { defaultTo, isNil } from 'lodash';
import httpStatus from 'http-status';
import { ServiceResponseJson as serviceResponseJson } from '../Helpers/Response';
import { Group } from 'src/group/entities/group.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class GroupsService {
  constructor(
    @InjectModel('Group') private readonly groupModel: Model<Group>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}
  async createGroup(createGroupDto: CreateGroupDto, request: any) {
    try {
      const { sub: user_id } = request.user;
      const { name, type } = createGroupDto;
      await this.groupModel.create({
        name,
        type,
        createdBy: user_id,
        isActive: true,
        isDeleted: false,
        isDisabled: false,
      });
      return {
        ...serviceResponseJson,
        statusCode: httpStatus.OK,
        status: true,
        message: 'group created successfully.',
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

  async addGroupMember(id: string, request: any): Promise<any> {
    try {
      const _id = request.body();
      const user = await this.userModel.findById(_id).exec();
      if (isNil(user)) {
        throw new HttpException('user does not exist', httpStatus.BAD_REQUEST);
      }
      const group = await this.groupModel.findById(id).exec();
      if (isNil(group)) {
        throw new HttpException('group not found', httpStatus.BAD_REQUEST);
      }
      group.members.push(user.id);
      await group.save();
      return {
        ...serviceResponseJson,
        statusCode: httpStatus.OK,
        status: true,
        message: 'group members updated successfully.',
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
    return `This action returns a #${id} channel`;
  }

  // update(id: number, updateGroupDto: UpdateGroupDto) {
  //   return `This action updates a #${(id, updateGroupDto)} channel`;
  // }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
