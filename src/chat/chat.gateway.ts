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
import { UpdateMessageDto } from 'src/messages/dto/update-message.dto';

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

    const { message } = savedMessage;
    if (!message) {
      console.error(' Error: Invalid message object received:', message);
      return;
    }
    const recipientSocketId = this.onlineUsers.get(data.recipientId);
    if (recipientSocketId) {
      console.log(
        'this is the message that i have been waiting for',
        recipientSocketId,
      );
      this.server.to(recipientSocketId).emit('new_message', message);
    }
  }

  private getUserFromSocket(socket: Socket): { id: string } {
    const token = socket.handshake.auth.token;
    const payload = this.jwtService.verify(token, {
      secret: jwtConstants.secret,
    });
    console.log('APAYLOAD', payload);
    return { id: payload.sub };
  }

  @SubscribeMessage('edit_message')
  async handleEditMessage(
    @MessageBody() data: UpdateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.getUserFromSocket(client);

    const message = await this.messageService.editMessage(user.id, data);
    const recipientSocketId = this.onlineUsers.get(
      message.recipientId.toString(),
    );
    const senderSocketId = this.onlineUsers.get(message.senderId.toString());

    const updatedMessage = message.toObject();
    updatedMessage.edited = true;

    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('message_edited', updatedMessage);
    }

    if (senderSocketId) {
      this.server.to(senderSocketId).emit('message_edited', updatedMessage);
    }
  }

  @SubscribeMessage('delete_message')
  async handleDeleteMessage(
    @MessageBody() data: UpdateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.getUserFromSocket(client);

    const message = await this.messageService.deleteMessage(user.id, data);
    const recipientSocketId = this.onlineUsers.get(
      message.recipientId.toString(),
    );
    const senderSocketId = this.onlineUsers.get(message.senderId.toString());

    const deletedMessagePayload = {
      messageId: message._id,
      isDeleted: true,
    };

    if (recipientSocketId) {
      this.server
        .to(recipientSocketId)
        .emit('message_deleted', deletedMessagePayload);
    }

    if (senderSocketId) {
      this.server
        .to(senderSocketId)
        .emit('message_deleted', deletedMessagePayload);
    }
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.log(`No token provided. Disconnecting socket: ${socket.id}`);
      socket.disconnect();
      return;
    }

    const { sub: userId } = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });
    if (userId) {
      const existingSocketId = this.onlineUsers.get(userId);
      console.log(':::::', existingSocketId, 'socket', socket.id);
      if (existingSocketId && existingSocketId !== socket.id) {
        console.log(
          `⚠️ User ${userId} already has an active socket. Disconnecting old socket: ${existingSocketId}`,
        );
        this.server.sockets.sockets.get(existingSocketId)?.disconnect(true);
      }

      this.onlineUsers.set(userId, socket.id);
      socket.join(userId);

      const messages = await this.messageModel
        .find({
          $or: [{ senderId: userId }, { recipientId: userId }],
        })
        .sort({ createdAt: 1 });

      socket.emit('load_previous_messages', messages);
    }
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

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { sender: string; recipient: string }) {
    const recipientSocketId = this.onlineUsers.get(data.recipient);
    if (recipientSocketId) {
      console.log('typing....', data.sender);
      this.server.to(recipientSocketId).emit('typing', { sender: data.sender });
    }
  }
}
