# Produce Catalog Service

a little go service. This one looks fun to modify

## supposedly

When this service is run the output should be similar to the following

```json
{"message":"successfully parsed product catalog json","severity":"info","timestamp":"2022-06-02T23:54:10.191283363Z"}
{"message":"starting grpc server at :3550","severity":"info","timestamp":"2022-06-02T23:54:10.191849078Z"}
```

## Local Build

You will need to install protoc if you haven't yet:

```sh
PB_REL="https://github.com/protocolbuffers/protobuf/releases"
curl -LO $PB_REL/download/v3.15.8/protoc-3.15.8-linux-x86_64.zip
unzip protoc-3.15.8-linux-x86_64.zip -d $HOME/.local
export PATH=$PATH:$(pwd)
```

and then install the golang protobuf compiler thing:

```sh
go install google.golang.org/protobuf/cmd/protoc-gen-go
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc
```

Don't commit the changes this makes to go.mod and go.sum. (What's the go equivalent of 'npm install -g'?)

To build the protos and the service binary, run:

```sh
protoc -I ../pb/ ../pb/demo.proto --go_out=./ --go-grpc_out=./
go build ./
```

## Docker Build

From the root directory, run:

```sh
docker compose build productcatalogservice
```
