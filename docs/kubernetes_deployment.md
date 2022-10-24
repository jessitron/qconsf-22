# Kubernetes

This repository includes a chart/ directory, which is based on the [OpenTelemetry Demo Helm
chart](https://github.com/open-telemetry/opentelemetry-helm-charts/tree/main/charts/opentelemetry-demo).

[Helm](https://helm.sh) must be installed to use the charts.
Please refer to Helm's [documentation](https://helm.sh/docs/) to get started.

## Prerequisites

- Pre-existing Kubernetes Cluster
- Helm 3.0+

## Install the Chart

Add OpenTelemetry Helm repository:

To install the chart with the release name my-otel-demo, run the following command from the root of this project:

```console
helm install my-otel-demo chart
```
