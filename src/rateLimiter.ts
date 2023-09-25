import { NextFunction, Request, Response } from "express";
import redisClient from "./redisClient";
import dotenv from "dotenv";

dotenv.config();

const defaults = {
    routePrefix: process.env.ROUTE_PREFIX || "",
    maxRequestsPerSecond: parseInt(process.env.MAX_REQUESTS_PER_SECOND || "0"),
    blockRequestStatusCode: parseInt(process.env.BLOCK_REQUEST_STATUS_CODE || "429"),
    blockRequestMessage: process.env.BLOCK_REQUEST_MESSAGE || "",
}

const redisRecordExpirySeconds = 1;

async function RateLimiter(request: Request, response: Response, next: NextFunction) {
    const ipAddress = request.ip;
    const key = defaults.routePrefix + ipAddress;

    const requestsServed = await redisClient.incr(key);

    if (requestsServed === 1) {
        await redisClient.expire(key, redisRecordExpirySeconds);
    }

    if (requestsServed > defaults.maxRequestsPerSecond) {
        return response.status(defaults.blockRequestStatusCode).send({
                message: defaults.blockRequestMessage
            });
    }
    
    next();
}

export { RateLimiter, defaults as config };