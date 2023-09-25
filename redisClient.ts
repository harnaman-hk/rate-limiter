import { RedisClientType, createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient: RedisClientType = createClient({
  socket: { host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT || "6379") },
});

try {
    await redisClient.connect();
    console.log("connected to redis")
} catch (error) {
    throw error;
}

export default redisClient;
