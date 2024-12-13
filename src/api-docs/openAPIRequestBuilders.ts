import type {ZodMediaTypeObject} from '@asteasolutions/zod-to-openapi';

export function createApiRequest({schema, ...rest}: ZodMediaTypeObject) {
  return {
    body: {
      content: {
        'application/json': {...rest, schema},
      },
    },
  };
}
