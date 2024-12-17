package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jardelbordignon/full-cycle-20/simulator/internal"
	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	mongoUri := getEnv("MONGO_URI", "mongodb://root:root@mongo:27017/routes?authSource=admin&directConnection=true")
	kafkaBroker := getEnv("KAFKA_BROKER", "kafka:9092")
	kafkaRouteTopic := getEnv("KAFKA_ROUTE_TOPIC", "route")
	kafkaFreightTopic := getEnv("KAFKA_FREIGHT_TOPIC", "freight")
	kafkaSimulationTopic := getEnv("KAFKA_SIMULATION_TOPIC", "simulation")
	kafkaGroupID := getEnv("KAFKA_GROUP_ID", "route-group")

	mongoConnection, err := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoUri))

	if err != nil {
		panic(err)
	}
	
	// checking mongo connection
	err = mongoConnection.Ping(context.Background(), nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("✅ Connected to MongoDB!")
	
	freightService := internal.NewFreightService()
	routeService := internal.NewRouteService(mongoConnection, freightService)
	channelDriverMoved := make(chan *internal.DriverMovedEvent)

	freightWriter := &kafka.Writer{
		Addr: kafka.TCP(kafkaBroker),
		Topic: kafkaFreightTopic,
		Balancer: &kafka.LeastBytes{},
	}
	
	simulatorWriter := &kafka.Writer{
		Addr: kafka.TCP(kafkaBroker),
		Topic: kafkaSimulationTopic,
		Balancer: &kafka.LeastBytes{},
	}

	routeReader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{kafkaBroker},
		Topic: kafkaRouteTopic,
		GroupID: kafkaGroupID,
	})

	eventHub := internal.NewEventHub(routeService, mongoConnection, channelDriverMoved, freightWriter, simulatorWriter)

	fmt.Println("🚀 Consuming events from 'route' topic...")

	for {
		message, err := routeReader.ReadMessage(context.Background())
		if err != nil {
			log.Printf("Error reading message: %v\n", err)
			continue
		}

		go func(msg []byte) {
			if err := eventHub.HandleEvent(msg); err != nil {
				log.Printf("Error handling event: %v\n", err)
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

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}