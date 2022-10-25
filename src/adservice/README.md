# Ad Service

The Ad service provides advertisement based on context keys. If no context keys
are provided then it returns random ads.

## Building Locally

The Ad service uses gradlew to compile/install/distribute. Gradle wrapper is
already part of the source code. To build Ad Service, run:

```sh
./gradlew installDist
```

It will create an executable script
`src/adservice/build/install/hipstershop/bin/AdService`.

### Upgrading Gradle

If you need to upgrade the version of gradle then run

```sh
./gradlew wrapper --gradle-version <new-version>
```

## Building Docker

From `src/adservice/`, run:

```sh
docker build ./
```
