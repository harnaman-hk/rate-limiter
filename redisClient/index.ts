import { RedisClientType, createClient } from "redis";
import dotenv from "dotenv";
import { DEFAULT_REDIS_HOST, DEFAULT_REDIS_PORT } from "./constants";

dotenv.config();

const redisClient: RedisClientType = createClient({
  socket: { 
    host: process.env.REDIS_HOST || DEFAULT_REDIS_HOST, 
    port: (process.env.REDIS_PORT || DEFAULT_REDIS_PORT) as number,
  },
});

try {
    await redisClient.connect();
    console.log("connected to redis")
} catch (error) {
    throw error;
}

export default redisClient;
