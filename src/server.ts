import cors from 'cors';
import express, {type Express} from 'express';
import helmet from 'helmet';

import {openAPIRouter} from '@/api-docs/openAPIRouter';
import {env} from '@/core/envConfig';
import errorHandler from '@/middleware/errorHandler.middleware';
import rateLimiter from '@/middleware/rateLimiter.middleware';
import requestLogger from '@/middleware/requestLogger.middleware';

const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: env.CORS_ORIGIN, credentials: true}));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger());

// Routes

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export {app};
