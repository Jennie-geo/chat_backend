import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register the model
  ],
  controllers: [AuthsController],
  providers: [AuthsService],
})
export class AuthsModule {}
