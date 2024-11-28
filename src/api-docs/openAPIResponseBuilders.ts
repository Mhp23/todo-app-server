import {createServiceResponseSchema} from '@/services/response.service';
import type {z} from 'zod';

export function createApiResponse(
  responses: Array<{
    status: number;
    description: string;
    schema?: z.ZodTypeAny | null;
  }>,
) {
  return responses.reduce(
    (acc, {status, schema, description}) => {
      acc[status] = {
        description,
        content: {
          'application/json': {
            schema: createServiceResponseSchema(schema),
          },
        },
      };
      return acc;
    },
    {} as Record<number, any>,
  );
}
