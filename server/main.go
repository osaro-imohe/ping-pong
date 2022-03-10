package main

import (
	"github.com/Ghvstcode/assesment/app"
	"github.com/Ghvstcode/assesment/config"
)

func main() {
	config := config.GetConfig()

	app := &app.App{}
	app.Initialize(config)
	app.Run(":8080")
}
