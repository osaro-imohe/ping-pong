FROM golang:1.11

WORKDIR /
COPY . .
RUN go mod download

CMD ["go","run","main.go"]