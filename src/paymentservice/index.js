// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Npm
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const health = require('grpc-health-check')
const opentelemetry = require('@opentelemetry/api')
const pino = require('pino')

// Local
const charge = require('./charge')

// Functions
async function chargeServiceHandler(call, callback) {
  const span = opentelemetry.trace.getActiveSpan();

  try {
    const amount = call.request.amount
    span.setAttributes({
      'app.payment.amount': parseFloat(`${amount.units}.${amount.nanos}`)
    })
    logger.info(`PaymentService#Charge invoked by: ${JSON.stringify(call.request)}`)

    const response = await charge.charge(call.request)
    callback(null, response)

  } catch (err) {
    logger.warn(err)

    span.recordException(err)
    span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR })

    callback(err)
  }
}

// Functions
async function closeGracefully(signal) {
  server.forceShutdown()
  process.kill(process.pid, signal)
}

// Main
const logger = pino()
const hipsterShopPackage = grpc.loadPackageDefinition(protoLoader.loadSync('demo.proto'))
const server = new grpc.Server()

server.addService(health.service, new health.Implementation({
  '': proto.grpc.health.v1.HealthCheckResponse.ServingStatus.SERVING
}))

server.addService(hipsterShopPackage.hipstershop.PaymentService.service, { charge: chargeServiceHandler })

server.bindAsync(`0.0.0.0:${process.env['PAYMENT_SERVICE_PORT']}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    return logger.error(err)
  }

  logger.info(`PaymentService gRPC server started on port ${port}`)
  server.start()
  }
)

process.once('SIGINT', closeGracefully)
process.once('SIGTERM', closeGracefully)
