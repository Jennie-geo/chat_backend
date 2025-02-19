import { Module } from '@nestjs/common';
import { ChannelsService } from './groups.service';
import { ChannelsController } from './groups.controller';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
