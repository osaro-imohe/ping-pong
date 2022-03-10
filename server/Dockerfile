FROM golang:1.10

WORKDIR /

COPY . .

COPY go.mod go.sum ./

RUN go mod download

CMD ["go","run","main.go"]