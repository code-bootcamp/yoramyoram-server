import { Request, Response } from 'express';

export interface IAuthUser {
  user?: {
    email: string;
    id: string;
    exp: number;
  };
}

export interface IContext {
  req: Request & IAuthUser;
  res: Response;
}

export interface IAdminAuthUser {
  adminUser?: {
    email: string;
    id: string;
    exp: number;
  };
}

export interface IAdminContext {
  req: Request & IAdminAuthUser;
  res: Response;
}
