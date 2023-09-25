import { NextFunction, Request, Response } from "express";
import redisClient from "../redisClient";
import dotenv from "dotenv";
import { DEFAULT_BLOCK_REQUEST_STATUS_CODE, DEFAULT_MAX_REQUESTS_PER_SECOND, DEFAULT_REDIS_EXPIRY_SECONDS } from "./constants"

dotenv.config();

const defaults = {
    routePrefix: process.env.ROUTE_PREFIX || "",
    maxRequestsPerSecond: (process.env.MAX_REQUESTS_PER_SECOND || DEFAULT_MAX_REQUESTS_PER_SECOND) as number,
    blockRequestStatusCode: (process.env.BLOCK_REQUEST_STATUS_CODE || DEFAULT_BLOCK_REQUEST_STATUS_CODE) as number,
    blockRequestMessage: process.env.BLOCK_REQUEST_MESSAGE || "",
    redisRecordExpirySeconds: (process.env.REDIS_EXPIRY_SECONDS || DEFAULT_REDIS_EXPIRY_SECONDS) as number,
}

async function RateLimiter(request: Request, response: Response, next: NextFunction) {
    const ipAddress = request.ip;
    const key = defaults.routePrefix + ipAddress;

    const newRecordRequestCount = 1;
    const requestsServed = await redisClient.incr(key);

    if (requestsServed === newRecordRequestCount) {
        await redisClient.expire(key, defaults.redisRecordExpirySeconds);
    }

    if (requestsServed > defaults.maxRequestsPerSecond) {
        return response.status(defaults.blockRequestStatusCode).send({
                message: defaults.blockRequestMessage
            });
    }
    
    next();
}

export { RateLimiter, defaults as config };