import { createClient } from "redis";

export async function createRedisClient(host, port) {
    const redisClient = createClient({
        socket: {
            host: host,
            port: port,
        }
    });
    
    await redisClient.connect();
    return redisClient;
}
