import {TodoModel} from '@/models/todo.model';
import type {TodoType} from '@/schemas/todo.schema';
import {ResponseService} from '@/services/response.service';
import {logger} from '@/utils/logger';
import {StatusCodes} from 'http-status-codes';

class TodoService {
  async getAll({accountId}: Pick<TodoType, 'accountId'>) {
    try {
      const todos = await TodoModel.find({accountId}).lean();
      return ResponseService.success(todos, 'Todos retrieved successfully.');
    } catch (e) {
      logger.error(e);
      return ResponseService.internalError();
    }
  }

  async add({
    accountId,
    description,
  }: Pick<TodoType, 'description' | 'accountId'>) {
    try {
      const newTodo = await TodoModel.create({accountId, description});

      return ResponseService.success(
        newTodo,
        'Todo created successfully.',
        StatusCodes.CREATED,
      );
    } catch (e) {
      logger.error(e);
      return ResponseService.internalError();
    }
  }

  async update({
    _id,
    accountId,
    completed,
    description,
  }: Pick<TodoType, '_id' | 'accountId' | 'completed' | 'description'>) {
    try {
      const todo = await TodoModel.findOne({_id, accountId});

      if (!todo) {
        return ResponseService.failure(
          'Todo not found.',
          StatusCodes.NOT_FOUND,
        );
      }
      todo.completed = completed;
      todo.description = description;
      const updatedTodo = await todo.save();

      return ResponseService.success(updatedTodo, 'Todo updated successfully.');
    } catch (e) {
      logger.error(e);
      return ResponseService.internalError();
    }
  }

  async delete({_id, accountId}: Pick<TodoType, '_id' | 'accountId'>) {
    try {
      const todo = await TodoModel.findOneAndDelete({_id, accountId});

      if (!todo) {
        return ResponseService.failure(
          'Todo not found.',
          StatusCodes.NOT_FOUND,
        );
      }
      return ResponseService.OK('Todo deleted successfully.');
    } catch (e) {
      logger.error(e);
      return ResponseService.internalError();
    }
  }
}

export const todoService = new TodoService();
