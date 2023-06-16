const defaults = {
    routePrefix: "",
    maxRequestsPerSecond: 2,
    blockRequestStatusCode: 429,
    blockRequestMessage: "Rate Limit Exceeded. Please try again later.",
}

const memory = new Map();

function RateLimiter(request, response, next) {
    const ipAddress = request.ip;
    const timestamp = Math.round(Date.now() / 1000);
    const key = defaults.routePrefix + ipAddress;
    const store = memory.get(key);

    if (store) {
        const counter = store[timestamp] ?? 0;
        if (counter >= defaults.maxRequestsPerSecond) {
            return response.status(defaults.blockRequestStatusCode).send({
                message: defaults.blockRequestMessage
            });
        } else {
            store[timestamp] = counter + 1;
        }
    } else {
        memory.set(key, {[timestamp]: 1});
    }
    
    next();
}

export default RateLimiter;