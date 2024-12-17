package internal

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/mongo"
)

type EventHub struct {
	routeService *RouteService
	mongoClient *mongo.Client
	channelDriverMoved chan *DriverMovedEvent
	freightWriter *kafka.Writer
	simulatorWriter *kafka.Writer
}

func NewEventHub(routeService *RouteService, mongoClient *mongo.Client, channelDriverMoved chan *DriverMovedEvent, freightWriter *kafka.Writer, simulatorWriter *kafka.Writer) *EventHub {
	return &EventHub{
		routeService: routeService,
		mongoClient: mongoClient,
		channelDriverMoved: channelDriverMoved,
		freightWriter: freightWriter,
		simulatorWriter: simulatorWriter,
	}
}

func (eventHub *EventHub) HandleEvent(msg []byte) error {
	var baseEvent struct {
		EventName string `json:"event"`
	}

	if err := json.Unmarshal(msg, &baseEvent); err != nil {
		return fmt.Errorf("error unmarshalling base event: %w", err)
	}

	switch baseEvent.EventName {
	case "RouteCreated":
		var event RouteCreatedEvent
		if err := json.Unmarshal(msg, &event); err != nil {
			return fmt.Errorf("error unmarshalling RouteCreatedEvent: %w", err)
		}
		return eventHub.handleRouteCreated(event)

	case "DeliveryStarted":
		var event DeliveryStartedEvent
		if err := json.Unmarshal(msg, &event); err != nil {
			return fmt.Errorf("error unmarshalling DeliveryStartedEvent: %w", err)
		}
		return eventHub.handleDeliveryStarted(event)

	default:
		return errors.New("unknown event type")
	}
}

func (eventHub *EventHub) handleRouteCreated(event RouteCreatedEvent) error {
	freightCalculatedEvent, err := RouteCreatedHandler(&event, eventHub.routeService)
	if err != nil {
		return fmt.Errorf("error handling route created event: %w", err)
	}

	value, err := json.Marshal(freightCalculatedEvent)
	if err != nil {
		return fmt.Errorf("error marshalling freight calculated event: %w", err)
	}

	err = eventHub.freightWriter.WriteMessages(context.Background(), kafka.Message{
		Key: []byte(freightCalculatedEvent.RouteID),
		Value: value,
	})
	if err != nil {
		return fmt.Errorf("error writing freight calculated event: %w", err)
	}

	fmt.Println("🚀 Freight calculated event sent!", freightCalculatedEvent)

	return nil
}

func (eventHub *EventHub) handleDeliveryStarted(event DeliveryStartedEvent) error {
	err := DeliveryStartedHandler(&event, eventHub.routeService, eventHub.channelDriverMoved)
	if err != nil {
		return fmt.Errorf("error handling delivery started event: %w", err)
	}

	go eventHub.sendDirections()	// goroute - thread leve gerenciada pelo go

	fmt.Println("🚀 Delivery started event sent!", event)

	return nil
}

func (eventHub *EventHub) sendDirections() {
	for {
		select {
			case movedEvent := <- eventHub.channelDriverMoved:
				value, err := json.Marshal(movedEvent)
				if err != nil {
					return
				}
		
				err = eventHub.simulatorWriter.WriteMessages(context.Background(), kafka.Message{
					Key: []byte(movedEvent.RouteID),
					Value: value,
				})
		
				if err != nil {
					return
				}
			case <- time.After(time.Millisecond * 500):
				return
		}
	}
}