package handler

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/osaro-imohe/ping-pong/server/app/websocket"
)

func ServeWS(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	roomId := vars["roomId"]
	ws, err := websocket.Upgrade(w, r)
	if err != nil {
		log.Println(err.Error())
	}

	c := &websocket.Connection{Send: make(chan []byte, 256), WS: ws}
	s := websocket.Subscription{Conn: c, Room: roomId}

	pool.Register <- s
	go s.WritePump()
	go s.ReadPump(pool)
}
