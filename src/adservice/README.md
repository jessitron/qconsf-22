# Ad Service

The Ad service provides advertisement based on context keys. If no context keys
are provided then it returns random ads.

This is straight Java with a gRPC server.

Notice that it uses the javaagent (in the CMD in the Dockerfile).
Then in the code it uses the OpenTelemetry API to pull tracerProviders and spans out of the air.

## Building locally

The Ad service uses gradlew to compile/install/distribute. Gradle wrapper is
already part of the source code. To build Ad Service, run:

```sh
./gradlew installDist
```

It will create executable script src/adservice/build/install/hipstershop/bin/AdService

### Upgrading gradle version

If you need to upgrade the version of gradle then run

```sh
./gradlew wrapper --gradle-version <new-version>
```

## Building docker image

From `src/adservice/`, run:

```sh
docker build ./
```
