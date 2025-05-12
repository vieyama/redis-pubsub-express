import Redis from 'ioredis';
import { config } from '../config';

let redis: Redis | null = null;

const createRedisConnection = async () => {
  try {
    redis = new Redis(config.redisUrl, {
      retryStrategy: (times: number) => {
        console.log(`Redis retry attempt ${times}`);
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      connectTimeout: 10000
    });

    redis.on('error', (err: Error) => {
      console.error('Redis connection error:', err);
    });

    redis.on('connect', () => {
      console.log('Connected to Redis');
    });

    redis.on('ready', () => {
      console.log('Redis client ready');
    });

    redis.on('reconnecting', () => {
      console.log('Reconnecting to Redis...');
    });

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Redis connection timeout'));
      }, 5000);

      redis!.once('ready', () => {
        clearTimeout(timeout);
        resolve();
      });

      redis!.once('error', (err: Error) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    return redis;
  } catch (error) {
    console.error('Failed to create Redis connection:', error);
    throw error;
  }
};

const initRedis = async () => {
  try {
    await createRedisConnection();
    console.log('Redis connection initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    process.exit(1);
  }
};

const initializeRedis = initRedis;

export { redis, initializeRedis, createRedisConnection };