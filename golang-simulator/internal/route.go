package internal

import (
	"math"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Location struct {
	Lat float64 `bson: "lat" json "lat"`
	Lng float64 `bson: "lng" json "lng"`
}

type Route struct {
	ID 					 string     `bson: "_id" json "id"`
	Distance 		 int        `bson: "distance" json "distance"`
	Directions	 []Location `bson: "directions" json "directions"`
	FreightPrice float64		`bson: "freightPrice" json "freightPrice"`
}

func NewRoute(id string, distance int, directions []Location) *Route {
	return &Route{
		ID: id,
		Distance: distance,
		Directions: directions,
	}
}


type FreightService struct {}

func NewFreightService() *FreightService {
	return &FreightService{}
}

func (freightService *FreightService) Calculate(distance int) float64 {
	return math.Floor((float64(distance) * 0.15 + 0.3) * 100) / 100
}

type RouteService struct {
	mongo *mongo.Client
	freightService *FreightService
}

func NewRouteService(mongo *mongo.Client, freightService *FreightService) *RouteService {
	return &RouteService{
		mongo: mongo,
		freightService: freightService,
	}
}


func (routeService *RouteService) CreateRoute(route *Route) (*Route, error) {
	route.FreightPrice = routeService.freightService.Calculate(route.Distance)

	filter := bson.M{"_id": route.ID}
	update := bson.M{
		"$set": bson.M{
			"distance": route.Distance,
			"directions": route.Directions,
			"freightPrice": route.FreightPrice,
		},
	}
	opts := options.Update().SetUpsert(true)

	_, err := routeService.mongo.Database("routes").Collection("routes").UpdateOne(nil, filter, update, opts)
	
	if err != nil {
		return nil, err
	}

	return route, nil
}

func (routeService *RouteService) GetRoute(id string) (Route, error) {
	var route Route
	filter := bson.M{"_id": route.ID}
	err := routeService.mongo.Database("routes").Collection("routes").FindOne(nil, filter).Decode(&route)

	if err != nil {
		return Route{}, err
	}

	return route, nil
}
