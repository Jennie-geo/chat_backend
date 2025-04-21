import { HttpException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { defaultTo, isEmpty, isNil } from 'lodash';
import httpStatus from 'http-status';
import { ServiceResponseJson as serviceResponseJson } from '../Helpers/Response';
import { Group } from 'src/group/entities/group.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class GroupsService {
  constructor(
    @InjectModel('Group') private readonly groupModel: Model<Group>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}
  async createGroup(createGroupDto: CreateGroupDto, request: any) {
    console.log('request. user', request.user);
    try {
      const { uuiqueId } = request.user;
      const { name, type } = createGroupDto;
      const groupExist = await this.groupModel.findOne({ name });
      if (!isNil(groupExist)) {
        throw new HttpException('goup name already exist', httpStatus.CONFLICT);
      }
      await this.groupModel.create({
        name,
        type,
        createdBy: uuiqueId,
        isActive: true,
        isDeleted: false,
        isDisabled: false,
        uniqueId: uuidv4(),
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

  async addGroupMember(uniqueId: string, request: any): Promise<any> {
    try {
      const { id } = request.body;
      const user = await this.userModel.findById({ _id: id }).exec();
      if (isNil(user)) {
        throw new HttpException('user does not exist', httpStatus.BAD_REQUEST);
      }
      const group = await this.groupModel
        .findOne({ uniqueId, createdBy: request.user.uuiqueId })
        .exec();
      if (isNil(group)) {
        throw new HttpException('group not found', httpStatus.BAD_REQUEST);
      }
      group.members.push(user.id);
      await group.save();
      return {
        ...serviceResponseJson,
        statusCode: httpStatus.CREATED,
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
  }

  async retrieveGroupMembers(uniqueId: string, request: any): Promise<any> {
    try {
      console.log('Unique id', request.user.sub);
      const group = await this.groupModel.findOne({ uniqueId });
      if (isNil(group)) {
        throw new HttpException('group not found', httpStatus.BAD_REQUEST);
      }
      const isMember = group.members.includes(
        request.user.uuiqueId || request.user.id,
      );
      console.log('isMember', isMember, request.user.sub);

      if (!isMember) {
        throw new HttpException(
          'you must be in the group to view members',
          httpStatus.FORBIDDEN,
        );
      }
      return {
        ...serviceResponseJson,
        statusCode: httpStatus.OK,
        status: true,
        message: 'group members retrieved successfully.',
        data: group.members,
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

  async searchForGroup(query: string) {
    try {
      const groupName = query.toLowerCase();
      //create atlas search index on mongodb atlas and the index name group here
      const group = await this.groupModel.aggregate([
        {
          $search: {
            index: 'group',
            text: {
              query: groupName.trim(),
              path: 'name',
              fuzzy: {},
              tokenOrder: 'sequential',
            },
          },
        },
        { $limit: 10 },
      ]);

      if (isNil(group) || isEmpty(group)) {
        throw new HttpException('No group found', httpStatus.OK);
      }
      return {
        ...serviceResponseJson,
        statusCode: httpStatus.OK,
        status: true,
        message: 'group retrieved successfully.',
        data: group,
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
