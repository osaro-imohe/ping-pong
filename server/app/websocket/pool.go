package websocket

import (
	"encoding/json"
	"log"
)

type Pool struct {
	State      State
	Register   chan Subscription
	Unregister chan Subscription
	Rooms      map[string]map[*Connection]bool
	Broadcast  chan Message
	Update     chan State
}

type Subscription struct {
	Conn *Connection
	Room string
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan Subscription),
		Unregister: make(chan Subscription),
		Rooms:      make(map[string]map[*Connection]bool),
		Broadcast:  make(chan Message),
	}
}

func (pool *Pool) Start() {
	for {
		select {
		case s := <-pool.Register:
			connections := pool.Rooms[s.Room]
			if connections == nil {
				connections = make(map[*Connection]bool)
				pool.Rooms[s.Room] = connections
			}
			pool.Rooms[s.Room][s.Conn] = true
		case s := <-pool.Unregister:
			connections := pool.Rooms[s.Room]
			if connections != nil {
				if _, ok := connections[s.Conn]; ok {
					delete(connections, s.Conn)
					close(s.Conn.Send)
					pool.State.PlayerTwo = Player{}
					if len(connections) == 0 {
						delete(pool.Rooms, s.Room)
					}
				}
			}
			state, err := json.Marshal(pool.State)
			if err != nil {
				log.Println(err.Error())
			}
			for c := range connections {
				c.Send <- state
			}
		case m := <-pool.Broadcast:
			connections := pool.Rooms[m.Room]
			for c := range connections {
				select {
				case c.Send <- m.Data:
				default:
					close(c.Send)
					delete(connections, c)
					if len(connections) == 0 {
						delete(pool.Rooms, m.Room)
					}
				}
			}
		}
	}
}
