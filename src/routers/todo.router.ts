import {todoController} from '@/controllers/todo.controller';
import {authenticateMiddleware} from '@/middleware/authentication.middleware';
import {validateRequest} from '@/middleware/httpHandlers.middleware';
import {TodoSchema} from '@/schemas/todo.schema';
import {generateBodySchema} from '@/utils/schemaGenerator';
import {Router} from 'express';

export const todoRouter = Router();

todoRouter.use(authenticateMiddleware);

todoRouter.get('/get-all', todoController.getAll);

todoRouter.post(
  '/add',
  validateRequest(
    generateBodySchema(
      TodoSchema.pick({
        description: true,
      }),
    ),
  ),
  todoController.add,
);

todoRouter.put(
  '/update',
  validateRequest(
    generateBodySchema(
      TodoSchema.pick({
        _id: true,
        completed: true,
        description: true,
      }),
    ),
  ),
  todoController.update,
);

todoRouter.delete('/delete', todoController.delete);
