import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChannelsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  create(@Body() createChannelDto: CreateGroupDto) {
    return this.channelsService.create(createChannelDto);
  }

  @Get()
  findAll() {
    return this.channelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.channelsService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelsService.remove(+id);
  }
}
