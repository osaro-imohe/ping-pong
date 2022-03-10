package main

import (
	"os"

	"github.com/osaro-imohe/ping-pong/server/app"
)

func main() {
	app := &app.App{}
	app.Initialize()
	app.Run(":" + os.Getenv("PORT"))
}
