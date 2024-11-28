import type {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import type {ZodError, ZodSchema} from 'zod';

import {ResponseService} from '@/services/response.service';

export const handleServiceResponse = (
  serviceResponse: ResponseService<any>,
  response: Response,
) => {
  return response
    .status(serviceResponse.response.status)
    .send(serviceResponse.response);
};

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({body: req.body, query: req.query, params: req.params});
      next();
    } catch (err) {
      const zodError = err as ZodError;
      const errorMessage = zodError.errors
        .map((e) => {
          const fieldName = e.path[1] ?? e.path[0];
          return `${fieldName}: ${e.message}`;
        })
        .join(', ');
      const statusCode = StatusCodes.BAD_REQUEST;
      const serviceResponse = ResponseService.failure(errorMessage, statusCode);
      handleServiceResponse(serviceResponse, res);
    }
  };
