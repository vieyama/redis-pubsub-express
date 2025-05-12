"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_jsdoc_swagger_1 = __importDefault(require("express-jsdoc-swagger"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const redis_1 = require("./utils/redis");
const config_1 = require("./config");
const sales_1 = __importDefault(require("./routes/sales"));
const subscribe_1 = __importDefault(require("./routes/subscribe"));
const isProd = process.env.NODE_ENV === 'production';
const app = (0, express_1.default)();
// Swagger configuration
const options = {
    info: {
        version: '1.0.0',
        title: 'Express Redis Prisma API',
        description: 'API documentation for Express Redis Prisma application',
    },
    baseDir: __dirname,
    filesPattern: isProd ? './**/*.js' : './**/*.ts',
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
(0, express_jsdoc_swagger_1.default)(app)(options);
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use('/api/sales', sales_1.default);
app.use('/api/subscribe', subscribe_1.default);
// Initialize Redis before starting the server
(0, redis_1.initializeRedis)().then(() => {
    app.listen(config_1.config.port, () => {
        console.log(`Server is running on port ${config_1.config.port}`);
    });
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
