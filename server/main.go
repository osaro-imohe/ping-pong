package main

import (
	"os"

	"github.com/osaro-imohe/ping-pong/server/app"
	"github.com/osaro-imohe/ping-pong/server/config"
)

func main() {
	config := config.GetConfig()

	app := &app.App{}
	app.Initialize(config)
	app.Run(":" + os.Getenv("PORT"))
}
