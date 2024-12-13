import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import {Types} from 'mongoose';
import {z} from 'zod';

extendZodWithOpenApi(z);

export const objectIdSchema = z.custom<Types.ObjectId>(
  (val) => Types.ObjectId.isValid(val),
  {
    message: 'Invalid ObjectId format.',
  },
);
