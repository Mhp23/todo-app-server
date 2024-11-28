import type {NextFunction, Request, Response} from 'express';
import {type Options, rateLimit} from 'express-rate-limit';

import {env} from '@/core/envConfig';
import {handleServiceResponse} from '@/middleware/httpHandlers.middleware';
import {ResponseService} from '@/services/response.service';

const reteLimtHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction,
  options: Options,
) => {
  return handleServiceResponse(
    ResponseService.failure(options.message, options.statusCode),
    res,
  );
};

const commonOptions: Partial<Options> = {
  legacyHeaders: false,
  standardHeaders: true,
  handler: reteLimtHandler,
  keyGenerator: (req: Request) => req.ip!,
  limit: env.COMMON_RATE_LIMIT_MAX_REQUESTS,
  windowMs: 15 * 60 * env.COMMON_RATE_LIMIT_WINDOW_MS,
  message: 'Too many requests, please try again later.',
};

const rateLimiter = rateLimit(commonOptions);

export const sensitiveRateLimiter = rateLimit({
  ...commonOptions,
  limit: env.SENSITIVE_RATE_LIMIT_WINDOW_MS,
});

export default rateLimiter;
