# Frontend service

The frontend is a [Next.js](https://nextjs.org/) application that is composed by two layers.

1. Client side application. Which renders the components for the OTEL webstore.
2. API layer. Connects the client to the backend services by exposing REST endpoints.

# Development in gitpod:

after opening the root of this repo in gitpod, open a terminal (ctrl-J) and then

`cd src/frontend`

`code .`

That opens a window in this directory. Then:

`npm install`

and then to build the protobufs: you'll need `protoc` installed. That's a little tricky but this works:

```sh
PB_REL="https://github.com/protocolbuffers/protobuf/releases"
curl -LO $PB_REL/download/v3.15.8/protoc-3.15.8-linux-x86_64.zip
unzip protoc-3.15.8-linux-x86_64.zip -d $HOME/.local
export PATH=$PATH:$(pwd)
cp -r ../../pb .
npm run grpc:generate
```

Then this works:

`npm run build`

and, to serve the app:

`npm run dev`

Then at the bottom right in the blue bar, look for "Ports: 3000" and click on that. It should open a tab with the app in
it.

## Build Locally

By running `docker compose up` at the root of the project you'll have access to the frontend client by going to
<http://localhost:8080/>.

## Local development

Currently, the easiest way to run the frontend for local development is to execute

```shell
docker compose run --service-ports -e NODE_ENV=development --volume $(pwd)/src/frontend:/app --volume $(pwd)/pb:/app/pb --user node --entrypoint sh frontend
```

from the root folder.

It will start all of the required backend services and within the container simply run `npm run dev`. After that the app
should be available at <http://localhost:8080/>.

## Collector Config

The app looks for a cookie named 'otelCollectorUrl' and gets its value on page load. This cookie key + value needs to be
set by a reverse proxy.

(TODO: I don't think we're getting frontend traces; our otel collector is not currently exposed.)
