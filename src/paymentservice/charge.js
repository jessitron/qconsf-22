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
const cardValidator = require('simple-card-validator');
const pino = require('pino');
const { v4: uuidv4 } = require('uuid');
const fraud = require('./fraud');

// Setup
const logger = pino();
const tracer = trace.getTracer('paymentservice');

// Functions
module.exports.charge = async request => {

  const fraudResult = await fraud.fraudCheck(request);
  if (fraudResult.sus == true) {
    logger.warn("This looks like fraud to us!");
    // we aren't acting on the fraud check yet
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

  if (!valid) {
    throw new Error('Credit card info is invalid.');
  }

  if (!['visa', 'mastercard'].includes(cardType)) {
    throw new Error(`Sorry, we cannot process ${cardType} credit cards. Only VISA or MasterCard is accepted.`);
  }
  
  if ((currentYear * 12 + currentMonth) > (year * 12 + month)) {
    throw new Error(`The credit card (ending ${lastFourDigits}) expired on ${month}/${year}.`);
  }

  logger.info(`Transaction ${transactionId}: ${cardType} ending ${lastFourDigits} | Amount: ${units}.${nanos} ${currencyCode}`);

  return { transactionId }
}
