import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

const connectWithRetry = async () => {
    while (true) {
        try {
            await redisClient.connect();
            break; // Exit the loop if connected successfully
        } catch (error) {
            console.error('Failed to connect to Redis, retrying in 5 seconds...', error);
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
        }
    }
};

connectWithRetry();

export default redisClient;
