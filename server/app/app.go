package app

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/osaro-imohe/ping-pong/server/app/handler"
	"github.com/osaro-imohe/ping-pong/server/app/model"
	"github.com/osaro-imohe/ping-pong/server/app/websocket"
	"github.com/osaro-imohe/ping-pong/server/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// App has router and db instances
type App struct {
	Router *mux.Router
	DB     *gorm.DB
	Pool   *websocket.Pool
}

// Initialize initializes the app with predefined configuration
func (a *App) Initialize(config *config.Config) {
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN: fmt.Sprintf("user=%s password=%s dbname=%s port=%d sslmode=disable", config.DB.Username, config.DB.Password, config.DB.Name, config.DB.Port),
	}), &gorm.Config{})

	if err != nil {
		log.Fatal("Could not connect database")
	}

	a.DB = model.DBMigrate(db)
	a.Router = mux.NewRouter()
	a.Pool = websocket.NewPool()
	go a.Pool.Start()
	a.setRouters()
}

// setRouters sets the all required routers
func (a *App) setRouters() {
	// a.Post("/new-player", a.handleRequest(handler.NewPlayer))
	a.Get("/new-game/{roomId}", a.handleSockets(handler.ServeWS))
}

// Get wraps the router for GET method
func (a *App) Get(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("GET")
}

// Post wraps the router for POST method
func (a *App) Post(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("POST")
}

// Run the app on it's router
func (a *App) Run(host string) {
	log.Fatal(http.ListenAndServe(host, a.Router))
	log.Println("Started Server")
}

type RequestHandlerFunction func(db *gorm.DB, w http.ResponseWriter, r *http.Request)

func (a *App) handleSockets(handler func(pool *websocket.Pool, w http.ResponseWriter, r *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		handler(a.Pool, w, r)
	}
}

func (a *App) handleRequest(handler func(db *gorm.DB, w http.ResponseWriter, r *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		handler(a.DB, w, r)
	}
}
