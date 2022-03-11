# 🏓 - Ping Pong

A multiplayer ping pong game 

| Service     | Description          | Stack                         |
| ----------- | -------------------- | ----------------------------- |
| Client      | Frontend React app   | TypeScript, React             |
| Backend API | Application server   | Golang, Websockets            |


## Running the Client locally

- Go to client folder `cd client`
- In `client/src/pages/game/index.tsx` file on line 65, change `wss://ping-pong-app-server.herokuapp.com/new-game/${gameCode}` to `wss://localhost:8080/new-game/${gameCode}`
- Run `yarn start`

## Running the Server locally

- Go to server folder `cd server`
- In the main.go file on line 12: change `app.Run(":" + os.Getenv("PORT"))` to `app.Run(":8080")`
- Run `go run main.go`

This application is live at: http://ping-pong-app-client.herokuapp.com/

Game Instructions:
1) Click the create a game button
2) Once the game has been created you'll notice a Game code at the top of the game. This code can be shared with others to join your ping pong session.
3) Open a new tab and click join game
4) Input the game code from the first game
5) Have fun!
