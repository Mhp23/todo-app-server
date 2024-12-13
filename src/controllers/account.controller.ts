import {handleServiceResponse} from '@/middleware/httpHandlers.middleware';
import {accountService} from '@/services/account.service';
import type {Request, Response} from 'express';

class AccountController {
  async register(req: Request, res: Response) {
    const createResponse = await accountService.register(req.body);
    handleServiceResponse(createResponse, res);
  }
  async login(req: Request, res: Response) {
    const loginResponse = await accountService.login(req.body);
    handleServiceResponse(loginResponse, res);
  }
  async refreshToken(req: Request, res: Response) {
    const refreshResponse = await accountService.refreshToken(req.body);
    handleServiceResponse(refreshResponse, res);
  }
  async logout(req: Request, res: Response) {
    const logoutResponse = await accountService.logout(req.body);
    handleServiceResponse(logoutResponse, res);
  }
}

export const accountController = new AccountController();
