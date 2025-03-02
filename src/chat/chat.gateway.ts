// import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import {
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   OnGatewayInit,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';

// import { Server, Socket } from 'socket.io';
// import { AuthGuard } from 'src/auths/auth.guard';

// @WebSocketGateway()
// export class ChatGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   private users = new Map<string, string>();
//   constructor(private jwtService: JwtService) {}
//   private readonly logger = new Logger(ChatGateway.name);

//   @WebSocketServer() io: Server;

//   afterInit() {
//     console.log('initialized');
//     this.logger.log('Initialized');
//   }
//   @UseGuards(AuthGuard)
//   handleConnection(client: any, ...args: any[]) {
//     const { sockets } = this.io.sockets;
//     console.log('initialized sockets', sockets);
//     const token = client.handshake.query.token as string;
//     if (!token) {
//       throw new UnauthorizedException('No token provided');
//     }
//     console.log('tokennnnnn', token);
//     const payload = this.jwtService.verify(token);
//     const userId = payload.sub;

//     this.users.set(userId, client.id);
//     this.logger.log(`Client id: ${client.id} connected`);
//     this.logger.debug(`Number of connected clients: ${sockets.size}`);
//   }

//   @SubscribeMessage('events')
//   handlePrivateMessage(
//     client: Socket,
//     payload: { recipientId: string; message: string },
//   ) {
//     const senderId = [...this.users.entries()].find(
//       ([_, socketId]) => socketId === client.id,
//     )?.[0];

//     if (!senderId) {
//       this.logger.warn('Unauthorized user tried to send a message');
//       return;
//     }

//     const recipientSocketId = this.users.get(payload.recipientId);
//     if (recipientSocketId) {
//       this.io.to(recipientSocketId).emit('new_message', {
//         senderId,
//         message: payload.message,
//       });

//       this.logger.log(
//         `Message from ${senderId} to ${payload.recipientId}: ${payload.message}`,
//       );
//     } else {
//       this.logger.warn(`User ${payload.recipientId} is not online`);
//     }
//   }

//   handleDisconnect(client: any) {
//     this.logger.log(`Cliend id:${client.id} disconnected`);
//   }

//   @SubscribeMessage('events')
//   handleMessage(client: any, data: any) {
//     this.logger.log(`Message received from client id: ${client.id}`);
//     this.logger.debug(`Payload: ${data}`);
//     return {
//       event: 'pong',
//       data: 'Wrong data that will make the test fail',
//     };
//   }
// }

// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { MessagesService } from 'src/messages/messages.service';

// @WebSocketGateway({
//   cors: {
//     origin: 'http://localhost:3000', // Allow frontend origin
//     credentials: true,
//   },
// })
// export class ChatGateway {
//   constructor(private messageService: MessagesService) {}
//   @WebSocketServer()
//   server: Server;

//   @SubscribeMessage('sendMessage')
//   async handleMessage(
//     @MessageBody()
//     data: { recipientId: string; message: string; senderId: string },
//     @ConnectedSocket() client: Socket,
//   ) {
//     await this.messageService.createMessage(data);
//     console.log(
//       `Message received: Recipient: ${data.recipientId}, Message: ${data.message}, Sender: ${data.senderId}`,
//     );
//     // Emit message to recipient
//     this.server.to(data.recipientId).emit('new_message', data);
//   }

//   handleConnection(client: Socket) {
//     console.log(`Client connected: ${client.id}`);
//   }

//   handleDisconnect(client: Socket) {
//     console.log(` Client disconnected: ${client.id}`);
//   }
// }

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auths/constant';
import { Message } from 'src/messages/entities/message.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Allow frontend origin
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private onlineUsers = new Map<string, string>();
  constructor(
    private messageService: MessagesService,
    private jwtService: JwtService,
    @InjectModel('Message') private messageModel: Model<Message>,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: { recipientId: string; message: string; senderId: string },
    // @ConnectedSocket() client: Socket,
  ) {
    const savedMessage = await this.messageService.createMessage(data);
    console.log('SAVED MESSAGE', savedMessage);
    const recipientSocketId = this.onlineUsers.get(data.recipientId);
    // console.log('online sent message::::::', recipientSocketId, savedMessage);
    const { message } = savedMessage;
    if (!message) {
      console.error(' Error: Invalid message object received:', message);
      return;
    }
    // console.log('this is the message', message);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('new_message', message);
    }
    console.log(` Sending message to room: ${recipientSocketId}`);
    console.log(`👥 All rooms available:`, this.server.sockets.adapter.rooms);
    // console.log(
    //   ` Message received: Recipient: ${data.recipientId}, Message: ${data.message}, Sender: ${data.senderId}`,
    // );
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const token = socket.handshake.auth.token;
    const { sub: userId } = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });
    console.log(`All rooms:`, this.server.sockets.adapter.rooms);
    console.log('USERID IN CONNECTION', userId);
    if (userId) {
      this.onlineUsers.set(userId, socket.id);
      socket.join(userId);

      const messages = await this.messageModel.find({ recipientId: userId });
      // console.log('CHECKING MESSAGE', messages);
      socket.emit('load_previous_messages', messages);
    }
    //   this.onlineUsers.set(userId, socket.id);
    //   this.server.emit('user-connected', { userId })
    // }
    console.log(` Client connected: ${socket.id}`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const userId = [...this.onlineUsers.entries()].find(
      ([, socketId]) => socketId === socket.id,
    )?.[0];
    console.log(`Client disconnected: ${socket.id}, userId ${userId}`);

    if (userId) {
      this.onlineUsers.delete(userId);
      this.server.emit('user-disconnected', { userId });
    }
  }

  // Handle typing indicator
  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { sender: string; recipient: string }) {
    const recipientSocketId = this.onlineUsers.get(data.recipient);
    if (recipientSocketId) {
      console.log('typing....', data.sender);
      this.server.to(recipientSocketId).emit('typing', { sender: data.sender });
    }
  }
}
