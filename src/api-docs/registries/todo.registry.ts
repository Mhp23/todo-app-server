import {createApiResponse} from '@/api-docs/openAPIResponseBuilders';
import {TodoSchema} from '@/schemas/todo.schema';
import {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
import {StatusCodes} from 'http-status-codes';
import {z} from 'zod';
import {createApiRequest} from '../openAPIRequestBuilders';

const BASE_PATH = '/api/todo';

export const todoRegistry = new OpenAPIRegistry();

todoRegistry.register('Todo', TodoSchema);

// Get All Todos
todoRegistry.registerPath({
  method: 'get',
  path: `${BASE_PATH}/get-all`,
  tags: ['Todo'],
  responses: createApiResponse([
    {
      status: StatusCodes.OK,
      description: 'Todos retrieved successfully',
      schema: z.array(TodoSchema),
    },
  ]),
});

// Add Todo
todoRegistry.registerPath({
  method: 'post',
  path: `${BASE_PATH}/add`,
  tags: ['Todo'],
  request: createApiRequest({
    schema: TodoSchema.pick({description: true}),
  }),
  responses: createApiResponse([
    {
      status: StatusCodes.CREATED,
      schema: TodoSchema,
      description: 'Todo added successfully',
    },
  ]),
});

// Update Todo
todoRegistry.registerPath({
  method: 'put',
  path: `${BASE_PATH}/update`,
  tags: ['Todo'],
  request: createApiRequest({
    schema: TodoSchema.pick({
      _id: true,
      completed: true,
      description: true,
    }),
  }),
  responses: createApiResponse([
    {
      status: StatusCodes.OK,
      schema: TodoSchema,
      description: 'Todo updated successfully',
    },
    {
      status: StatusCodes.NOT_FOUND,
      description: 'Todo not found',
    },
  ]),
});

// Delete Todo
todoRegistry.registerPath({
  method: 'delete',
  path: `${BASE_PATH}/delete`,
  tags: ['Todo'],
  request: createApiRequest({
    schema: TodoSchema.pick({
      _id: true,
      accountId: true,
    }),
  }),
  responses: createApiResponse([
    {
      status: StatusCodes.OK,
      description: 'Todo deleted successfully',
    },
    {
      status: StatusCodes.NOT_FOUND,
      description: 'Todo not found',
    },
  ]),
});
