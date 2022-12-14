const pino = require('pino');
const axios = require('axios');
const otel = require('@opentelemetry/api');

const logger = pino();

const NoResult = {message: "no info"};

module.exports.fraudCheck = async request => {
    const span = otel.trace.getActiveSpan();
    span?.setAttribute("app.fraudCheck.start", true);

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
        return fraudOpinion;
    } catch (err) {
        logger.error(err);
        logger.warn("Unable to check fraud, dependency unavailable");
        span?.recordException(err);
        return NoResult;
    }    
}