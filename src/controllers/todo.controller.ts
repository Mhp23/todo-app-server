import {handleServiceResponse} from '@/middleware/httpHandlers.middleware';
import {todoService} from '@/services/todo.service';
import type {Request, Response} from 'express';

class TodoController {
  async getAll(req: Request, res: Response) {
    const createResponse = await todoService.getAll({
      accountId: req!.account!._id,
    });
    handleServiceResponse(createResponse, res);
  }
  async add(req: Request, res: Response) {
    const loginResponse = await todoService.add({
      accountId: req!.account!._id,
      description: req.body.description,
    });
    handleServiceResponse(loginResponse, res);
  }
  async update(req: Request, res: Response) {
    const {_id, completed, description} = req.body;
    const refreshResponse = await todoService.update({
      _id,
      completed,
      description,
      accountId: req!.account!._id,
    });
    handleServiceResponse(refreshResponse, res);
  }
  async delete(req: Request, res: Response) {
    const logoutResponse = await todoService.delete({
      _id: req.body._id,
      accountId: req!.account!._id,
    });
    handleServiceResponse(logoutResponse, res);
  }
}

export const todoController = new TodoController();
