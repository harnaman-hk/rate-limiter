import express from "express";
import { RateLimiter, config as rateLimiterConfig } from "../rateLimiter";

const app = express();
const PORT = 8080;

rateLimiterConfig.maxRequestsPerSecond = 3;

app.use(RateLimiter);

app.get("/", (req, res) => {
    res.status(200).send({
        success: true,
        message: "request is served"
    })
})

app.listen(PORT, () => {
    console.log(`Application is listening on port ${PORT}`);
})