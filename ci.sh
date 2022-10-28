#!/bin/bash

cowsay "Let's do some building!"

function srcToServiceName() {
  service=$1
  if [[ $service == "paymentservice" ]]; then
    echo "payment-service"
    return 0
  fi
  if [[ $service == "adservice" ]]; then
    echo "ad-service"
    return 0
  fi
  if [[ $service == "cartservice" ]]; then
    echo "cart-service"
    return 0
  fi
  if [[ $service == "checkoutservice" ]]; then
    echo "checkout-service"
    return 0
  fi
  if [[ $service == "currencyservice" ]]; then
    echo "currency-service"
    return 0
  fi
  if [[ $service == "featureflagservice" ]]; then
    echo "featureflag-service"
    return 0
  fi
  if [[ $service == "frontend" ]]; then
    echo "frontend"
    return 0
  fi
  if [[ $service == "cartservice" ]]; then
    echo "cart-service"
    return 0
  fi
  if [[ $service == "loadgenerator" ]]; then
    echo "loadgenerator"
    return 0
  fi
  if [[ $service == "productcatalogservice" ]]; then
    echo "product-catalog-service"
    return 0
  fi
  if [[ $service == "quoteservice" ]]; then
    echo "quote-service"
    return 0
  fi
  if [[ $service == "recommendationservice" ]]; then
    echo "recommendation-service"
    return 0
  fi
  if [[ $service == "shippingservice" ]]; then
    echo "shipping-service"
    return 0
  fi
  if [[ $service == "whataservice" ]]; then
    echo "whataservice"
    return 0
  fi
  echo "unknown-dataset"
}

function doTheThing() {
  prevCommit=$(git rev-parse HEAD)
  output=$(git pull)
  returnCode=$?
  if [[ $? -ne 0 ]]; then
    echo "git pull maybe returned " $returnCode
    cowsay "Git pull failed y'all"
    exit 1
  fi
  echo "The output from git pull is: " $output

  nothingToDo="Already up to date" # wrap the heart medication in the cheese

  if [[ "$output" =~ $nothingToDo.* ]]; then
    echo "Nothing new to see here..."
    return 0
  fi

  echo "something happened! These files changed:"
  git diff --name-only $prevCommit
  currentCommit=$(git rev-parse HEAD)
  changedServices=$(git diff --name-only $prevCommit | grep ^src | cut -d '/' -f 2)
  startTime=$(date +%s)

  cowsay "let's deploy..."
  skaffold run
  #echo "insert skaffold run here"
  returned=$?

  if [[ -n $HONEYCOMB_API_KEY ]]; then
    echo "The following services were changed: $changedServices"
    endTime=$(date +%s)
    for service in $changedServices; do
      serviceDataset=$(srcToServiceName $service)
      echo "Creating marker in $serviceDataset for $service" 
      curl https://api.honeycomb.io/1/markers/$serviceDataset -X POST  \
        -H "X-Honeycomb-Team: $HONEYCOMB_API_KEY"  \
        -d "{\"message\":\"deploy $currentCommit \", \"type\":\"deploy\", \"start_time\":$startTime, \"end_time\":$endTime}"
    done
  else
    echo "HONEYCOMB_API_KEY not defined"
  fi

  if [[ $returned -ne 0 ]]; then
    cowsay "OH NO"
  fi

  echo "😊 well that was exciting 😊 "
}

while :
do
  date
  doTheThing
  sleep 30
done
