# Checkout Service

This service provides checkout services for the application.

## Local Build

To build the protos and the service binary, run:

```sh
protoc -I ../pb/ ../pb/demo.proto --go_out=./ --go-grpc_out=./
go build -o /go/bin/checkoutservice/ ./
```

## Docker Build

This one is in golang. Here, the ctx (which is a standard thing in golang) gets passed around everywhere, and the necessary span context is stored there.

## development?

From the root directory, run:

```sh
docker compose build checkoutservice
```
