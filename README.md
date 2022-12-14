# ![otel-photo](./docs/img/opentelemetry-logo-nav.png) Jess & Martin's OpenTelemetry Workshop

This repository is forked from [Open-telemetry/opentelemetry-demo](https://github.com/open-telemetry/opentelemetry-demo) (in [October of 2022](https://github.com/open-telemetry/opentelemetry-demo/commit/b6e75ee44cc41bb8315e5e116cc1ac4807ef5e1d))
by the Honeycomb DevRel team, in order to create a workshop.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/jessitron/qconsf-22)

## How to build

Can the individual projects be built separately? surely. Check each one's Dockerfile for how.

To build and run the whole thing,

you need:

- [Docker](./docs/docker_deployment.md)
- [Kubernetes](./docs/kubernetes_deployment.md)
- skaffold
- helm
- kubectl

... and a k8s to deploy it to. (could be minikube)

`skaffold run` (install skaffold)

# stuff that is copied over

## Getting Started

## Documentation

- [Demo Screenshots](./docs/demo_screenshots.md)
- [Feature Flags](./docs/feature_flags.md)
- [Manual Span Attributes](./docs/manual_span_attributes.md)
- [Metric Feature Coverage by Service](./docs/metric_service_features.md)
- [Requirements](./docs/requirements/README.md)
- [Service Roles](./docs/service_table.md)
- [Trace Feature Coverage by Service](./docs/trace_service_features.md)

## Architecture

**Online Boutique** is composed of microservices written in different programming
languages that talk to each other over gRPC and HTTP; and a load generator which
uses [Locust](https://locust.io/) to fake user traffic.

```mermaid
graph TD

subgraph Service Diagram
adservice(Ad Service):::java
cache[(Cache<br/>&#40redis&#41)]
cartservice(Cart Service):::dotnet
checkoutservice(Checkout Service):::golang
currencyservice(Currency Service):::cpp
emailservice(Email Service):::ruby
frontend(Frontend):::javascript
loadgenerator([Load Generator]):::python
paymentservice(Payment Service):::javascript
productcatalogservice(ProductCatalog Service):::golang
quoteservice(Quote Service):::php
recommendationservice(Recommendation Service):::python
shippingservice(Shipping Service):::rust
featureflagservice(Feature Flag Service):::erlang
featureflagstore[(Feature Flag Store<br/>&#40PostgreSQL DB&#41)]

Internet -->|HTTP| frontend
loadgenerator -->|HTTP| frontend

checkoutservice --> cartservice --> cache
checkoutservice --> productcatalogservice
checkoutservice --> currencyservice
checkoutservice -->|HTTP| emailservice
checkoutservice --> paymentservice
checkoutservice --> shippingservice

frontend --> adservice
frontend --> cartservice
frontend --> productcatalogservice
frontend --> checkoutservice
frontend --> currencyservice
frontend --> recommendationservice --> productcatalogservice
frontend --> shippingservice -->|HTTP| quoteservice

productcatalogservice --> |evalFlag| featureflagservice

shippingservice --> |evalFlag| featureflagservice

featureflagservice --> featureflagstore

end
classDef java fill:#b07219,color:white;
classDef dotnet fill:#178600,color:white;
classDef golang fill:#00add8,color:black;
classDef cpp fill:#f34b7d,color:white;
classDef ruby fill:#701516,color:white;
classDef python fill:#3572A5,color:white;
classDef javascript fill:#f1e05a,color:black;
classDef rust fill:#dea584,color:black;
classDef erlang fill:#b83998,color:white;
classDef php fill:#4f5d95,color:white;
```

```mermaid
graph TD
subgraph Service Legend
  javasvc(Java):::java
  dotnetsvc(.NET):::dotnet
  golangsvc(Go):::golang
  cppsvc(C++):::cpp
  rubysvc(Ruby):::ruby
  pythonsvc(Python):::python
  javascriptsvc(JavaScript):::javascript
  rustsvc(Rust):::rust
  erlangsvc(Erlang/Elixir):::erlang
  phpsvc(PHP):::php
end

classDef java fill:#b07219,color:white;
classDef dotnet fill:#178600,color:white;
classDef golang fill:#00add8,color:black;
classDef cpp fill:#f34b7d,color:white;
classDef ruby fill:#701516,color:white;
classDef python fill:#3572A5,color:white;
classDef javascript fill:#f1e05a,color:black;
classDef rust fill:#dea584,color:black;
classDef erlang fill:#b83998,color:white;
classDef php fill:#4f5d95,color:white;
```

Find the **Protocol Buffer Definitions** in the `/pb/` directory.

## Features

- **[Kubernetes](https://kubernetes.io)**: the app is designed to run on
  Kubernetes (both locally , as well as on the cloud).
- **[gRPC](https://grpc.io)**: microservices use a high volume of gRPC calls to
  communicate to each other.
- **[OpenTelemetry Traces](https://opentelemetry.io)**: all services are
  instrumented using OpenTelemetry available instrumentation libraries.
- **[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started)**:
  all services are instrumented and sending the generated traces to the
  OpenTelemetry Collector via gRPC. The received traces are then exported to the
  logs and to Jaeger.
- **[Jaeger](https://www.jaegertracing.io)**: all generated traces are being
  sent to Jaeger.
- **Synthetic Load Generation**: the application demo comes with a background
  job that creates realistic usage patterns on the website using
  [Locust](https://locust.io/) load generator.
- **[Prometheus](https://prometheus.io/)**: all generated metrics are being
  sent to Prometheus.
- **[Grafana](https://grafana.com/)**: all metric dashboards are stored in Grafana.

## Demos featuring Online Boutique

- [Datadog](https://github.com/DataDog/opentelemetry-demo-webstore)
- [Honeycomb.io](https://github.com/honeycombio/opentelemetry-demo-webstore)
- [Lightstep](https://github.com/lightstep/opentelemetry-demo-webstore)
- [New Relic](https://github.com/newrelic-forks/opentelemetry-demo)

## Contributing

This is a temporary project, derived from [Open Telemetry Demo](https://github.com/open-telemetry/opentelemetry-demo). Contribute there!

### Thanks to all the people who have contributed

[![contributors](https://contributors-img.web.app/image?repo=open-telemetry/opentelemetry-demo)](https://github.com/open-telemetry/opentelemetry-demo/graphs/contributors)
