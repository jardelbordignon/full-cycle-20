#Events

## Ao receber o evento de criação de rota 
RouteCreated
  - id
  - distance
  - directions
  - - lat
  - - lng

### Vamos executar alguma lógica de calculo de frete e retornar outro evento
FreightCalculated
 - routeId
 - amount

 ----

 ## Ao receber o evento de rota iniciada
 DeliveryStarted
  - routeId
 
 ### Vamos disparar eventos com a posição atual do motorista
 DriverMoved
  - routeId
  - lat
  - lng