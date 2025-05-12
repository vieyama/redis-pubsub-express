"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isDocker = process.env.DOCKER_ENV === 'true';
exports.config = {
    port: process.env.PORT || 3000,
    redisUrl: isDocker
        ? 'redis://redis:6379' // Docker service name
        : process.env.REDIS_URL || 'redis://localhost:6379',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/pubsub?schema=public'
};
