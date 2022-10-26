
const protoLoader = require('@grpc/proto-loader')
var grpc = require('@grpc/grpc-js');

const hipsterShopPackage = grpc.loadPackageDefinition(protoLoader.loadSync('demo.proto'))
console.log("methods on the package:")
Object.keys(hipsterShopPackage).forEach((k) => console.log(k))
var client = new hipsterShopPackage.hipstershop.PaymentService('localhost:8080',
                                       grpc.credentials.createInsecure());


function runGetFeature() {
  function chargeCallback(error, chargeResult) {
    if (error) {
        console.log("Error!!! " + JSON.stringify(error));
        return;
    }
    console.log("Here is the result: " + JSON.stringify(chargeResult));
  }
  const chargeRequest = {
    amount: {
        currencyCode: "USD",
        units: 2,
        nanos: 0
    },
    creditCard: {    
        credit_card_number: "4141414141414141",
        credit_card_cvv: 333,
        credit_card_expiration_year: 2020,
        credit_card_expiration_month: 3
    }
  }
  client.Charge(chargeRequest, chargeCallback);
}

runGetFeature();
