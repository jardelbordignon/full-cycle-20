import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: (requestOrigin, callback) => {
      if (process.env.CORS_ORIGIN?.split(',').includes(requestOrigin)) {
        callback(null, true);
      } else {
        callback(new Error('Request not allowed by CORS'));
      }
    },
  },
})
export class RoutesDriverGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    // client.emit('xyz', payload); // envia para quem enviou a mensagem
    // client.broadcast.emit('xyz', payload); // envia para todos que estiverem conectados ao evento xyz
    console.log('payload:', payload);
    return 'Hello world!';
  }
}
