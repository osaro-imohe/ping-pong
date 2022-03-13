package main

import (
	"fmt"
	"os"

	"github.com/osaro-imohe/ping-pong/server/app"
)

func main() {
	app := &app.App{}
	app.Initialize()
	fmt.Println(os.Getenv("PORT"))
	app.Run(":" + app.GetEnv("PORT", "8080"))
}
