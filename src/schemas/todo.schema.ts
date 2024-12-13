import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import {z} from 'zod';
import {objectIdSchema} from './global.schema';

extendZodWithOpenApi(z);

export const TodoSchema = z.object({
  _id: objectIdSchema,
  accountId: objectIdSchema,
  description: z
    .string()
    .max(256, {message: 'Description must not exceed 256 characters.'}),
  completed: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TodoType = z.infer<typeof TodoSchema>;
