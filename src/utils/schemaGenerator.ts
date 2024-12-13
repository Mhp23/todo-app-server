import z from 'zod';

export const generateBodySchema = (object: z.ZodObject<any>) => {
  return z.object({body: object});
};
