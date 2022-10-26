# Payment Service

This service is responsible for processing and validating payments through the
application.

## Local Build

Copy the `demo.proto` file to this directory and run `npm ci`

`cp ../../pb/demo.proto .`

`npm ci`

`npm run start`

## Docker Build

From the root directory, run:

```sh
docker compose build paymentservice
```
