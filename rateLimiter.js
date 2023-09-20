import { createRedisClient } from "./redisClient.js";

const defaults = {
    redisConfig: {
        host: "127.0.0.1",
        port: 6379
    },
    routePrefix: "",
    maxRequestsPerSecond: 100,
    blockRequestStatusCode: 429,
    blockRequestMessage: "Rate Limit Exceeded. Please try again later.",
}

let redisClient = null;
const redisRecordExpiry = 1;

async function RateLimiter(request, response, next) {
    const ipAddress = request.ip;
    const key = defaults.routePrefix + ipAddress;

    if (redisClient == null) {
        redisClient = await createRedisClient(defaults.redisConfig.host, defaults.redisConfig.port)
                            .catch(err => { throw(err) });
    }

    const requestsServed = await redisClient.incr(key);

    if (requestsServed == 1) {
        await redisClient.expire(key, redisRecordExpiry);
    }

    if (requestsServed > defaults.maxRequestsPerSecond) {
        return response.status(defaults.blockRequestStatusCode).send({
                message: defaults.blockRequestMessage
            });
    }
    
    next();
}

export { RateLimiter, defaults as config };