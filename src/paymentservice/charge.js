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
const {context, propagation, trace} = require('@opentelemetry/api');
const cardValidator = require('simple-card-validator');
const pino = require('pino');
const { v4: uuidv4 } = require('uuid');
const fraud = require('./fraud');

// Setup
const logger = pino();
const tracer = trace.getTracer('paymentservice');

// Functions
module.exports.charge = async request => {
  const span = tracer.startSpan('charge');

  const fraudResult = await fraud.fraudCheck(request);
  span.setAttribute("app.fraud.result", JSON.stringify(fraudResult))
  if (fraudResult.sus == true) {
    throw new Error("This looks like fraud to us!");
  }

  const { creditCardNumber: number,
    creditCardExpirationYear: year,
    creditCardExpirationMonth: month
  } = request.creditCard;
  const { units, nanos, currencyCode } = request.amount;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const lastFourDigits = number.substr(-4);
  const transactionId = uuidv4();

  const card = cardValidator(number);
  const {card_type: cardType, valid } = card.getCardDetails();

  span.setAttributes({
    'app.payment.card_type': cardType,
    'app.payment.card_valid': valid
  });

  if (!valid) {
    throw new Error('Credit card info is invalid.');
  }

  if (!['visa', 'mastercard'].includes(cardType)) {
    throw new Error(`Sorry, we cannot process ${cardType} credit cards. Only VISA or MasterCard is accepted.`);
  }
  
  if ((currentYear * 12 + currentMonth) > (year * 12 + month)) {
    throw new Error(`The credit card (ending ${lastFourDigits}) expired on ${month}/${year}.`);
  }

  // check baggage for synthetic_request=true, and add charged attribute accordingly
  const baggage = propagation.getBaggage(context.active());
  if (baggage && baggage.getEntry("synthetic_request") && baggage.getEntry("synthetic_request").value == "true") {
    span.setAttribute('app.payment.charged', false);
  } else {
    span.setAttribute('app.payment.charged', true);
  }

  span.end();

  logger.info(`Transaction ${transactionId}: ${cardType} ending ${lastFourDigits} | Amount: ${units}.${nanos} ${currencyCode}`);

  return { transactionId }
}
