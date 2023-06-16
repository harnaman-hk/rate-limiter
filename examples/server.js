import express from "express";
import { RateLimiter, config } from "../rateLimiter.js";

const app = express();
const PORT = 8080;

config.maxRequestsPerSecond = 3;

app.get("/", RateLimiter, (req, res) => {
    res.status(200).send({
        success: true,
        message: "request is served"
    })
})

app.listen(PORT, () => {
    console.log(`Application is listening on port ${PORT}`);
})