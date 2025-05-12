"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisConnection = exports.initializeRedis = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../config");
let redis = null;
exports.redis = redis;
const createRedisConnection = async () => {
    try {
        exports.redis = redis = new ioredis_1.default(config_1.config.redisUrl, {
            retryStrategy: (times) => {
                console.log(`Redis retry attempt ${times}`);
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            connectTimeout: 10000
        });
        redis.on('error', (err) => {
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
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Redis connection timeout'));
            }, 5000);
            redis.once('ready', () => {
                clearTimeout(timeout);
                resolve();
            });
            redis.once('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
        return redis;
    }
    catch (error) {
        console.error('Failed to create Redis connection:', error);
        throw error;
    }
};
exports.createRedisConnection = createRedisConnection;
const initRedis = async () => {
    try {
        await createRedisConnection();
        console.log('Redis connection initialized successfully');
    }
    catch (error) {
        console.error('Failed to initialize Redis:', error);
        process.exit(1);
    }
};
const initializeRedis = initRedis;
exports.initializeRedis = initializeRedis;
