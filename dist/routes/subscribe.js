"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("../services/redis");
const subscribeRouter = express_1.default.Router();
/**
 * GET /api/subscribe
 * @summary Subscribe to sales updates via Server-Sent Events (SSE)
 * @tags Subscribe
 * @description Establishes a Server-Sent Events connection to receive real-time sales updates
 * @return {text/event-stream} 200 - SSE connection established
 * @example
 * // Client-side code
 * const eventSource = new EventSource('/api/subscribe');
 * eventSource.onmessage = (event) => {
 *   const data = JSON.parse(event.data);
 *   console.log('Received update:', data);
 * };
 */
subscribeRouter.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const subscriber = await (0, redis_1.subscribe)('sales-updates', (message) => {
        res.write(`data: ${JSON.stringify(message)}\n\n`);
    });
    req.on('close', () => {
        subscriber.disconnect();
    });
});
exports.default = subscribeRouter;
