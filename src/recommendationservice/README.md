# Recommendation Service

This service provides recommendations for other products based on the currently
selected product.

Note how the Dockerfile calls some opentelemetry executables to get the instrumentation in there.

## Local Build

To build the protos:

```sh
pip install -r requirements.txt
cp -r ../../pb ./proto
python -m pip install grpcio-tools==1.48.2
python -m grpc_tools.protoc -I=../pb/ --python_out=./ --grpc_python_out=./ ../pb/demo.proto
```

Then run:

`python recommendation_server.py`


## Docker Build

From the root directory, run:

```sh
docker build -f src/recommendationservice/Dockerfile .
```
