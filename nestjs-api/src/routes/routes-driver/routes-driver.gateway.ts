import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { RoutesService } from '../routes.service';

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
  constructor(private routesService: RoutesService) {}

  @SubscribeMessage('client:new-points')
  async handleNewPoints(client: any, payload: any) {
    // client.emit('xyz', payload); // envia para quem enviou a mensagem
    // client.broadcast.emit('xyz', payload); // envia para todos que estiverem conectados ao evento xyz
    const { routeId } = payload
    const route = await this.routesService.findOne(routeId)

    if (!route) {
      throw new Error('Route does not exists')
    }

    // @ts-expect-error - routes has not been defined
    const { steps } = route.directions!.routes[0].legs[0]
    for (const step of steps) {
      const startData = {
        ...step.start_location,
        routeId,
      }
      client.emit(`server:new-points/${routeId}:list`, startData)
      client.broadcast.emit('server:new-points:list', startData)
      await sleep(2000)

      const endData = {
        ...step.end_location,
        routeId,
      }
      client.emit(`server:new-points/${routeId}:list`, endData)
      client.broadcast.emit('server:new-points:list', endData)
      await sleep(2000)
    }
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
