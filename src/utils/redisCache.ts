import { redis } from './redis';

const checkRedisReady = () => {
  if (!redis || redis.status !== 'ready') {
    throw new Error('Redis not ready');
  }
};

export const safeGet = async (key: string) => {
  checkRedisReady();
  return await redis!.get(key);
};

export const safeSet = async (key: string, value: string, ttl?: number) => {
  checkRedisReady();
  if (ttl) {
    return await redis!.set(key, value, 'EX', ttl);
  }
  return await redis!.set(key, value);
};

export const safeDel = async (key: string) => {
  checkRedisReady();
  return await redis!.del(key);
};
