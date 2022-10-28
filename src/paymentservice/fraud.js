const pino = require('pino');
const axios = require('axios');

const logger = pino();

const NoResult = {message: "no info"};

module.exports.fraudCheck = async request => {

    const url = process.env.FRAUD_CHECK_URL || "http://qcon-java-team-whataservice:8080/";
    try {
        const result = await axios.post(url, request);
        if (result.status !== 200 ) {
            logger.warn("Got status: " + result.status);
            return NoResult;
        }
        const fraudOpinion = result.data;
        logger.info("Result of fraud check: " + JSON.stringify(fraudOpinion));
        return fraudOpinion;
    } catch (err) {
        logger.error(err);
        logger.warn("Unable to check fraud, dependency unavailable");
        return NoResult;
    }    
}