"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedis = exports.subscribe = exports.publish = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis_1 = require("../utils/redis");
const config_1 = require("../config");
const publish = async (channel, message) => {
    try {
        if (!redis_1.redis || redis_1.redis.status !== 'ready') {
            throw new Error('Redis not ready');
        }
        await redis_1.redis.publish(channel, JSON.stringify(message));
    }
    catch (error) {
        console.error('Error publishing to Redis:', error);
        throw error;
    }
};
exports.publish = publish;
const subscribe = async (channel, callback) => {
    try {
        if (!redis_1.redis || redis_1.redis.status !== 'ready') {
            throw new Error('Redis not ready');
        }
        const subscriber = new ioredis_1.default(config_1.config.redisUrl);
        await subscriber.subscribe(channel);
        subscriber.on('message', (ch, message) => {
            if (ch === channel) {
                callback(JSON.parse(message));
            }
        });
        return subscriber;
    }
    catch (error) {
        console.error('Error subscribing to Redis:', error);
        throw error;
    }
};
exports.subscribe = subscribe;
const getRedis = () => {
    if (!redis_1.redis) {
        throw new Error('Redis not initialized');
    }
    return redis_1.redis;
};
exports.getRedis = getRedis;
