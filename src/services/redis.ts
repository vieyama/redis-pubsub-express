import Redis from 'ioredis';
import { redis } from "../utils/redis";
import { config } from '../config';

export const publish = async (channel: string, message: any) => {
  try {
    if (!redis || redis.status !== 'ready') {
      throw new Error('Redis not ready');
    }
    await redis.publish(channel, JSON.stringify(message));
  } catch (error) {
    console.error('Error publishing to Redis:', error);
    throw error;
  }
};

export const subscribe = async (channel: string, callback: (message: any) => void) => {
  try {
    if (!redis || redis.status !== 'ready') {
      throw new Error('Redis not ready');
    }
    const subscriber = new Redis(config.redisUrl);
    await subscriber.subscribe(channel);
    
    subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(JSON.parse(message));
      }
    });

    return subscriber;
  } catch (error) {
    console.error('Error subscribing to Redis:', error);
    throw error;
  }
};

export const getRedis = () => {
  if (!redis) {
    throw new Error('Redis not initialized');
  }
  return redis;
}; 