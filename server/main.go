package main

import (
	"github.com/osaro-imohe/ping-pong/server/app"
)

func main() {
	app := &app.App{}
	app.Initialize()
	app.Run(":8080")
}
