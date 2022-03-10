package handler

import "github.com/google/uuid"

func GenerateIdentifier() string {
	return uuid.NewString()
}
