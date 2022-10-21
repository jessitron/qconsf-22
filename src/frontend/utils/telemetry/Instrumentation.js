const { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } = require('@opentelemetry/core');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { NodeSDK, api } = require('@opentelemetry/sdk-node');

// set log level to DEBUG for a lot of output
api.diag.setLogger(new api.DiagConsoleLogger(), api.DiagLogLevel.DEBUG);

api.propagation.setGlobalPropagator(
  new CompositePropagator({
    propagators: [new W3CBaggagePropagator(), new W3CTraceContextPropagator()],
  })
);

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://workshop-release-otelcol:4318',
  }),
  instrumentations: getNodeAutoInstrumentations(),
});

sdk.start();
