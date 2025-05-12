import express from 'express';
import { createClient } from 'redis';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import cors from 'cors';
import helmet from 'helmet';
import { initializeRedis } from './utils/redis';
import { config } from './config';
import salesRouter from './routes/sales';
import subscribeRouter from './routes/subscribe';

const isDev = process.env.NODE_ENV === 'development';

const app = express();

// Swagger configuration
const options = {
  info: {
    version: '1.0.0',
    title: 'Express Redis Prisma API',
    description: 'API documentation for Express Redis Prisma application',
  },
  baseDir: __dirname,
  filesPattern: isDev ? './**/*.ts' : './**/*.js',
  swaggerUIPath: '/api-docs',
  exposeSwaggerUI: true,
  exposeApiDocs: true,
  apiDocsPath: '/api-docs.json',
  swaggerUIOptions: {
    explorer: true
  },
  security: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
    },
  },
};

// Initialize Swagger
expressJSDocSwagger(app)(options);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/sales', salesRouter);
app.use('/api/subscribe', subscribeRouter);

// Initialize Redis before starting the server
initializeRedis().then(() => {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}).catch((error: Error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 