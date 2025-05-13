import express from 'express'
import { subscribe } from '../services/redis';

const subscribeRouter = express.Router()

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
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const subscriber = await subscribe('sales-updates', (message) => {
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  });

  req.on('close', () => {
    subscriber.disconnect();
  });
});

export default subscribeRouter
