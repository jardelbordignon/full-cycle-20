package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jardelbordignon/full-cycle-20/simulator/internal"
	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {

	mongoUri := "mongodb://root:root@localhost:27017/routes?authSource=admin"
	mongoConnection, err := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoUri))

	if err != nil {
		panic(err)
	}

	freightService := internal.NewFreightService()
	routeService := internal.NewRouteService(mongoConnection, freightService)
	channelDriverMoved := make(chan *internal.DriverMovedEvent)
	kafkaBroker := "localhost:9092"

	freightWriter := &kafka.Writer{
		Addr: kafka.TCP(kafkaBroker),
		Topic: "freight",
		Balancer: &kafka.LeastBytes{},
	}
	
	simulatorWriter := &kafka.Writer{
		Addr: kafka.TCP(kafkaBroker),
		Topic: "simulator",
		Balancer: &kafka.LeastBytes{},
	}

	routerReader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{kafkaBroker},
		Topic: "route",
		GroupID: "simulator",
	})

	eventHub := internal.NewEventHub(routeService, mongoConnection, channelDriverMoved, freightWriter, simulatorWriter)

	fmt.Println("Starting simulator...")
	for {
		message, err := routerReader.ReadMessage(context.Background())
		if err != nil {
			log.Printf("error: %v", err)
			continue
		}

		go func(msg []byte) {
			err = eventHub.HandleEvent(message.Value)
			if err != nil {
				log.Printf("error handling event: %v", err)
			}
		}(message.Value)

	}

	// routeCreatedEvent := internal.NewRouteCreatedEvent(
	// 	"route-1", 
	// 	100, 
	// 	[]internal.Location{
	// 		{Lat: 0, Lng: 0},
	// 		{Lat: 5, Lng: 5},
	// 		{Lat: 10, Lng: 10},
	// 	},
	// )

	// fmt.Println(internal.RouteCreatedHandler(routeCreatedEvent, routeService))
}
