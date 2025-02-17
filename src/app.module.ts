import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './auth/auth.module';
import { ChannelsModule } from './channels/channels.module';
import { Connection } from 'mongoose';
import { CommentModule } from './comment/comment.module';
import Joi from 'joi';
import 'dotenv/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().port().default(3002),
      }),
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL!, {
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
    }),
    UsersModule,
    ChannelsModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
