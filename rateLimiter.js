const defaults = {
    blockRequestStatusCode: 429,
    blockRequestMessage: "Rate Limit Exceeded. Please try again later.",
}

function RateLimiter(req, res, next) {
    console.log("ratelimiter is called")
    next();
}

export default RateLimiter;