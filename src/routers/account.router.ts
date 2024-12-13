import {accountController} from '@/controllers/account.controller';
import {validateRequest} from '@/middleware/httpHandlers.middleware';
import {sensitiveRateLimiter} from '@/middleware/rateLimiter.middleware';
import {AccountSchema, CredentialsSchema} from '@/schemas/account.schema';
import {generateBodySchema} from '@/utils/schemaGenerator';
import {Router} from 'express';

export const accountRouter = Router();

accountRouter.use(sensitiveRateLimiter);

accountRouter.post(
  '/register',
  validateRequest(generateBodySchema(CredentialsSchema)),
  accountController.register,
);

accountRouter.post(
  '/login',
  validateRequest(generateBodySchema(CredentialsSchema)),
  accountController.login,
);

accountRouter.post(
  '/refresh-token',
  validateRequest(
    generateBodySchema(
      AccountSchema.pick({
        _id: true,
        refreshToken: true,
      }),
    ),
  ),
  accountController.refreshToken,
);

accountRouter.post(
  '/logout',
  validateRequest(
    generateBodySchema(
      AccountSchema.pick({
        _id: true,
      }),
    ),
  ),
  accountController.logout,
);
