import {createApiResponse} from '@/api-docs/openAPIResponseBuilders';
import {
  AccessibleAccountSchema,
  AccountSchema,
  CredentialsSchema,
} from '@/schemas/account.schema';
import {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
import {StatusCodes} from 'http-status-codes';
import {createApiRequest} from '../openAPIRequestBuilders';

const BASE_PATH = '/api/account';

export const accountRegistry = new OpenAPIRegistry();

accountRegistry.register('Account', AccountSchema);

// Register New Account
accountRegistry.registerPath({
  method: 'post',
  path: `${BASE_PATH}/register`,
  tags: ['Account'],
  request: createApiRequest({schema: CredentialsSchema}),
  responses: createApiResponse([
    {
      status: StatusCodes.CREATED,
      description: 'Account created successfully',
      schema: AccessibleAccountSchema,
    },
    {
      status: StatusCodes.CONFLICT,
      description: 'Username already exists',
    },
  ]),
});

// Login
accountRegistry.registerPath({
  method: 'post',
  path: `${BASE_PATH}/login`,
  tags: ['Account'],
  request: createApiRequest({schema: CredentialsSchema}),
  responses: createApiResponse([
    {
      status: StatusCodes.OK,
      schema: AccessibleAccountSchema,
      description: 'Login successful',
    },
    {
      status: StatusCodes.UNAUTHORIZED,
      description: 'Invalid username or password',
    },
  ]),
});

// Refresh Token
accountRegistry.registerPath({
  method: 'post',
  path: `${BASE_PATH}/refresh-token`,
  tags: ['Account'],
  request: createApiRequest({
    schema: AccessibleAccountSchema.pick({_id: true, refreshToken: true}),
  }),
  responses: createApiResponse([
    {
      status: StatusCodes.OK,
      schema: AccessibleAccountSchema,
      description: 'Access token refreshed successfully',
    },
    {
      status: StatusCodes.UNAUTHORIZED,
      description: 'Invalid refresh token | Refresh token has expired',
    },
  ]),
});

// Logout
accountRegistry.registerPath({
  method: 'post',
  path: `${BASE_PATH}/logout`,
  tags: ['Account'],
  request: createApiRequest({
    schema: AccountSchema.pick({_id: true}),
  }),
  responses: createApiResponse([
    {
      status: StatusCodes.OK,
      description: 'Logout successful',
    },
    {
      status: StatusCodes.NOT_FOUND,
      description: 'Account not found',
    },
  ]),
});
