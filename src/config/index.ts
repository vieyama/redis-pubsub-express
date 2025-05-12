import dotenv from 'dotenv';

dotenv.config();

const isDocker = process.env.DOCKER_ENV === 'true';

export const config = {
  port: process.env.APP_PORT || 3001,
  redisUrl: isDocker 
    ? 'redis://redis:6379'  // Docker service name
    : process.env.REDIS_URL || 'redis://localhost:6379',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/pubsub?schema=public'
}; 