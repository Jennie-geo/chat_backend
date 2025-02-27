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

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Allow frontend origin
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody()
    data: { recipientId: string; message: string; senderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('📩 Message received:', data);
    console.log(
      `📩 Message received: Recipient: ${data.recipientId}, Message: ${data.message}, Sender: ${data.senderId}`,
    );
    // Emit message to recipient
    this.server.to(data.recipientId).emit('new_message', data);
  }

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }
}
