import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class ChannelsService {
  create(createGroupDto: CreateGroupDto) {
    return 'This action adds a new channel';
  }

  findAll() {
    return `This action returns all channels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
