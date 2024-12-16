import type {SigningContentType} from '@/core/types';
import {handleServiceResponse} from '@/middleware/httpHandlers.middleware';
import {ResponseService} from '@/services/response.service';
import {verifyToken} from '@/utils/jwt';
import type {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

export const authenticateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    const response = ResponseService.failure(
      'Access token is required.',
      StatusCodes.UNAUTHORIZED,
    );
    handleServiceResponse(response, res);
    return;
  }
  const payload = verifyToken<SigningContentType>(accessToken, 'access');

  if (!payload?._id) {
    const response = ResponseService.failure(
      'Invalid or expired access token.',
      StatusCodes.UNAUTHORIZED,
    );
    handleServiceResponse(response, res);
    return;
  }
  req.account = payload;
  next();
};
