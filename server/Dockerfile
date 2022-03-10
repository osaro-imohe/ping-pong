FROM golang:1.10

WORKDIR /

COPY . .

RUN go mod init

RUN go build  -o /server

CMD ["go","run","main.go"]