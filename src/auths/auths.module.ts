import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register the model
  ],
  controllers: [AuthsController],
  providers: [AuthsService],
})
export class AuthsModule {}
