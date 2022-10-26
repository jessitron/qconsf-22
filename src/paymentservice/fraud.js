const pino = require('pino');
const axios = require('axios');
const otel = require('@opentelemetry/api');

const logger = pino();

const NoResult = {};

module.exports.fraudCheck = async request => {
    console.log("Fraud check time: " + request)
    const span = otel.trace.getActiveSpan();

    try {
       const result = await axios.get("http://try-this-whataservice:8080");
       if (result.status !== 200 ) {
        logger.warn("Got status: " + result.status);
        span?.addAttribute("app.fraudstatus", result.status)
          return NoResult;
       }
       const fraudOpinion = result.data;
       logger.info("Result of fraud check: " + JSON.stringify(fraudOpinion));
       span?.addAttribute("app.fraud.result", JSON.stringify(fraudOpinion));
       return { sus: false };
    } catch (err) {
        logger.error(err);
        logger.warn("Unable to check fraud, dependency unavailable");
        return NoResult;
    }

    
}