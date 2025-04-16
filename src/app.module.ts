import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './user/user.module';
import { GroupsModule } from './group/groups.module';
import { Connection } from 'mongoose';
import * as Joi from 'joi';
import 'dotenv/config';
import { NODE_ENV } from './app/constants/app.constant';
import { AuthsController } from './auths/auths.controller';
import { AuthsService } from './auths/auths.service';
import { AuthsModule } from './auths/auths.module';
import { User, UserSchema } from './user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ChatGateway } from './chat/chat.gateway';
import { EventModule } from './chat/chat.gateway.module';
import { MessagesService } from './messages/messages.service';
import { Message, GroupSchema } from './messages/entities/message.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION)
          .default(NODE_ENV.DEVELOPMENT),
        PORT: Joi.number().port().required().default(3002),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MongooseModule.forRoot(
      'mongodb+srv://isintumejenny:SvsnSPlLK8OHRN3j@cluster0.8ljje.mongodb.net/',
      {
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () =>
            console.log('Database successfully connected'),
          );
          connection.on('open', () => console.log('connection is fully open'));
          connection.on('disconnected', () => console.log('disconnected'));
          // connection.on('reconnected', () => console.log('reconnected'));
          // connection.on('disconnecting', () => console.log('disconnecting'));

          return connection;
        },
      },
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: GroupSchema },
    ]),
    UsersModule,
    GroupsModule,
    AuthsModule,
    EventModule,
  ],
  controllers: [AppController, AuthsController],
  providers: [
    AppService,
    AuthsService,
    JwtService,
    ChatGateway,
    MessagesService,
  ],
})
export class AppModule {}
