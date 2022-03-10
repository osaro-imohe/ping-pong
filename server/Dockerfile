FROM golang:1.13

WORKDIR /
COPY . .
RUN apt update && apt install ca-certificates libgnutls30 -y
RUN go install

CMD ["go","run","main.go"]