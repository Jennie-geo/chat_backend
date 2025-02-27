import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { ChannelsController } from './groups.controller';
import { Group, GroupSchema } from './entities/group.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.entity';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
  ],
  controllers: [ChannelsController],
  providers: [GroupsService],
})
export class GroupsModule {}
