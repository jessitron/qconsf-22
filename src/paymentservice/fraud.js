const pino = require('pino');
const axios = require('axios');
const otel = require('@opentelemetry/api');

const logger = pino();

const NoResult = {message: "no info"};

module.exports.fraudCheck = async request => {
    console.log("what does the request have? " + JSON.stringify(request));
    const span = otel.trace.getActiveSpan();
    logger.info("Did I find a span? " + span?.spanContext().spanId);

    const url = process.env.FRAUD_CHECK_URL || "http://qcon-java-team-whataservice:8080/";
    try {
        const result = await axios.post(url, request);
        span?.setAttribute("app.fraud.httpstatus", result.status)
        if (result.status !== 200 ) {
            logger.warn("Got status: " + result.status);
            return NoResult;
        }
        const fraudOpinion = result.data;
        logger.info("Result of fraud check: " + JSON.stringify(fraudOpinion));
        span?.setAttribute("app.fraud.result", JSON.stringify(fraudOpinion));
        return { sus: false };
    } catch (err) {
        logger.error(err);
        logger.warn("Unable to check fraud, dependency unavailable");
        return NoResult;
    }

    
}