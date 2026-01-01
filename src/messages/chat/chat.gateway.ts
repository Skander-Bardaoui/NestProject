import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagesService } from '../messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
  ) {}

  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() data: { content: string }) {
    const message = await this.messagesService.create(
      data.content,
      'sent',
    );

    // send to all connected clients
    this.server.emit('receive_message', message);

    return message;
  }
}
