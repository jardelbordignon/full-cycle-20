import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class RoutesDriverGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    // client.emit('xyz', payload); // envia para quem enviou a mensagem
    // client.broadcast.emit('xyz', payload); // envia para todos que estiverem conectados ao evento xyz
    console.log('payload:', payload);
    return 'Hello world!';
  }
}
