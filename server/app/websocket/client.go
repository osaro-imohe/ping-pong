package websocket

import (
	"encoding/json"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

type Ball struct {
	X         int
	Y         int
	Width     int
	Height    int
	Radius    int
	VelocityX int
	VelocityY int
	Speed     int
}

type Player struct {
	PaddleWidth  int
	PaddleHeight int
	X            int
	Y            int
	Score        int
	ID           string
}

type State struct {
	PlayerOne Player
	PlayerTwo Player
	Ball      Ball
	Board     Board
	Playing   bool
}

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
}

type ClientValues struct {
	X      int
	Y      int
	Width  int
	Height int
}

type ClientMessage struct {
	User    string
	Message string
	Value   ClientValues
}
type Connection struct {
	WS   *websocket.Conn
	Send chan []byte
}

type Board struct {
	Width  int
	Height int
}

type Paddle struct {
	Width  int
	Height int
}
type Message struct {
	Data []byte
	Room string
}

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	paddleOffsetX = 5

	// Maximum message size allowed from peer.
	// maxMessageSize = 512
)

var board = &Board{
	Width:  800,
	Height: 380,
}

var paddle = &Paddle{
	Width:  50,
	Height: 150,
}

func NewBall() Ball {
	return Ball{
		Radius:    20,
		VelocityX: -1,
		VelocityY: 1,
		Speed:     5,
		Height:    30,
		Width:     30,
		X:         (board.Width - 60) / 2,
		Y:         (board.Height - 60) / 2,
	}
}

// readPump pumps messages from the websocket connection to the pool.
func (s Subscription) ReadPump(pool *Pool) {
	c := s.Conn
	defer func() {
		pool.Unregister <- s
		c.WS.Close()
	}()
	for {
		_, msg, err := c.WS.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Printf("error: %v", err)
			}
			break
		}

		c.MsgHandler(msg, pool, s)
	}
}

func (c *Connection) MsgHandler(msg []byte, pool *Pool, s Subscription) {
	umsg := ClientMessage{}
	err := json.Unmarshal(msg, &umsg)

	if err != nil {
		log.Println("error message", err.Error())
	}

	if umsg.Message == "connected" {
		player := Player{}
		initPaddlePosition := (board.Height / 2) - (paddle.Height / 2)
		if len(pool.Rooms[s.Room]) < 2 {
			p1 := updatePlayer(player, paddle.Width, paddle.Height, paddleOffsetX, initPaddlePosition, 0, umsg.User)
			p2 := updatePlayer(player, paddle.Width, paddle.Height, paddleOffsetX, initPaddlePosition, 0, "")
			pool.State.PlayerOne = p1
			pool.State.PlayerTwo = p2
			pool.State.Board = *board
		} else {
			np := updatePlayer(player, paddle.Width, paddle.Height, paddleOffsetX, initPaddlePosition, 0, umsg.User)
			pool.State.PlayerTwo = np
			pool.State.Board = *board
		}
		pool.State.Ball = NewBall()
	}
	if umsg.Message == "move-paddle-up" {
		player, ps := getPlayer(pool, umsg.User)

		if player.Y > 14 {
			np := updatePlayer(player, player.PaddleWidth, player.PaddleHeight, player.X, player.Y-14, player.Score, player.ID)
			if ps == "PlayerOne" {
				pool.State.PlayerOne = np
			} else {
				pool.State.PlayerTwo = np
			}
		}
	}
	if umsg.Message == "move-paddle-down" {
		player, ps := getPlayer(pool, umsg.User)

		if player.Y < board.Height-player.PaddleHeight-14 {
			np := updatePlayer(player, player.PaddleWidth, player.PaddleHeight, player.X, player.Y+14, player.Score, player.ID)
			if ps == "PlayerOne" {
				pool.State.PlayerOne = np
			} else {
				pool.State.PlayerTwo = np
			}
		}

	}
	if umsg.Message == "start-game" {
		if !pool.State.Playing {
			pool.State.Playing = true
			go moveBall(pool, s)
		}
	}

	p, err := json.Marshal(pool.State)
	if err != nil {
		log.Println(err.Error())
	}
	pool.Broadcast <- Message{[]byte(p), s.Room}
}

func getPlayer(pool *Pool, user string) (Player, string) {
	return func() (Player, string) {
		if user == pool.State.PlayerOne.ID {
			return pool.State.PlayerOne, "PlayerOne"
		} else {
			return pool.State.PlayerTwo, "PlayerTwo"
		}
	}()
}

func updateBall(ball Ball, width int, height int, x int, y int, radius int, velocityX int, velocityY int, speed int) Ball {
	nb := Ball{
		X:         x,
		Y:         y,
		Radius:    radius,
		VelocityX: velocityX,
		VelocityY: velocityY,
		Speed:     speed,
		Width:     width,
		Height:    height,
	}
	return nb
}

func updatePlayer(player Player, width int, height int, x int, y int, score int, id string) Player {
	np := Player{
		PaddleWidth:  width,
		PaddleHeight: height,
		X:            x,
		Y:            y,
		Score:        score,
		ID:           id,
	}
	return np
}

func moveBall(pool *Pool, s Subscription) {
	ticker := time.NewTicker(time.Second / 60)
	quit := make(chan struct{})
	if len(pool.Rooms[s.Room]) < 2 {
		pool.State.Playing = false
		return
	}

	for {
		select {
		case <-ticker.C:
			if len(pool.Rooms[s.Room]) < 2 {
				pool.State.Ball = NewBall()
				pool.State.Playing = false
				state, err := json.Marshal(pool.State)

				if err != nil {
					log.Println(err)
				}
				pool.Broadcast <- Message{[]byte(state), s.Room}
				return
			}
			b := pool.State.Ball
			p1 := pool.State.PlayerOne
			p2 := pool.State.PlayerTwo

			nb := updateBall(b, b.Width, b.Height, b.X+b.VelocityX, b.Y+b.VelocityY, b.Radius, b.VelocityX, b.VelocityY, b.Speed)
			pool.State.Ball = nb

			// handle bounce of top and bottom
			if b.Y == 0 {
				nb := updateBall(b, b.Width, b.Height, b.X, b.Height, b.Radius, b.VelocityX, -b.VelocityY, b.Speed)
				pool.State.Ball = nb
			} else if b.Y == board.Height-b.Height-5 {
				nb := updateBall(b, b.Width, b.Height, b.X, board.Height-2*b.Height, b.Radius, b.VelocityX, -b.VelocityY, b.Speed)
				pool.State.Ball = nb
			}

			// check if ball hit the boundary (game lost)
			if b.X == board.Width-b.Height {
				np := updatePlayer(p1, p1.PaddleWidth, p1.PaddleHeight, p1.X, p1.Y, p1.Score+1, p1.ID)
				pool.State.PlayerOne = np
				pool.State.Playing = false
				state, err := json.Marshal(pool.State)

				if err != nil {
					log.Println(err)
				}
				pool.Broadcast <- Message{[]byte(state), s.Room}
				resetBall(pool, s)
				return
			} else if b.X == 0 {
				np := updatePlayer(p2, p2.PaddleWidth, p2.PaddleHeight, p2.X, p2.Y, p2.Score+1, p2.ID)
				pool.State.PlayerTwo = np
				pool.State.Playing = false
				state, err := json.Marshal(pool.State)

				if err != nil {
					log.Println(err)
				}
				pool.Broadcast <- Message{[]byte(state), s.Room}
				resetBall(pool, s)
				return
			}

			// bounce off paddles
			if b.X == p1.PaddleWidth+p1.X &&
				b.Y > p1.Y &&
				b.Y < p1.Y+p1.PaddleHeight {
				nb := updateBall(b, b.Width, b.Height, b.Height+b.Radius+p1.PaddleHeight/2, b.Y, b.Radius, -b.VelocityX, b.VelocityY, b.Speed)
				pool.State.Ball = nb
			} else if b.X == board.Width-(p2.X+p2.PaddleWidth+b.Width) &&
				b.Y > p2.Y &&
				b.Y < p2.Y+p2.PaddleHeight {
				nb := updateBall(b, b.Width, b.Height, board.Width-2*p1.PaddleWidth, b.Y, b.Radius, -b.VelocityX, b.VelocityY, b.Speed)
				pool.State.Ball = nb
			}

			state, err := json.Marshal(pool.State)

			if err != nil {
				log.Println(err)
			}
			pool.Broadcast <- Message{[]byte(state), s.Room}
		case <-quit:
			ticker.Stop()
			return
		}
	}
}

// func impact(b *Ball, p *Player) bool {
// 	top := p.Y
// 	bottom := p.Y + p.Height
// }

// write writes a message with the given message type and payload.
func (c *Connection) write(mt int, payload []byte) error {
	c.WS.SetWriteDeadline(time.Now().Add(writeWait))
	return c.WS.WriteMessage(mt, payload)
}

func resetBall(pool *Pool, s Subscription) {
	pool.State.Ball = NewBall()
	state, err := json.Marshal(pool.State)

	if err != nil {
		log.Println(err)
	}
	pool.Broadcast <- Message{[]byte(state), s.Room}
}

// writePump pumps messages from the pool to the websocket connection.
func (s *Subscription) WritePump() {
	c := s.Conn
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.WS.Close()
	}()
	for {
		select {
		case message, ok := <-c.Send:
			if !ok {
				c.write(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.write(websocket.TextMessage, message); err != nil {
				return
			}
		case <-ticker.C:
			if err := c.write(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}
