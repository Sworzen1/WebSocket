import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('New user connect: ', client.id);

    client.broadcast.emit('join', {
      message: `${client.id} join to chat`,
    });
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnect: ', client.id);

    this.server.emit('left', {
      message: `${client.id} left the chat`,
    });
  }

  @SubscribeMessage('chat')
  handleEvent(client: Socket, message: string) {
    client.broadcast.emit('message', message);
  }
}
