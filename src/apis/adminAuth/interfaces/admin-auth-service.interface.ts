import { Response, Request } from 'express';
import { AdminUser } from 'src/apis/adminUser/entities/user.entity';
import { IAdminAuthUser } from 'src/commons/types/context';

export interface IAdminAuthServiceGetAccessToken {
  adminUser: AdminUser | IAdminAuthUser['adminUser'];
}

export interface IAdminAuthServiceSetRefreshToken {
  adminUser: AdminUser;
  res: Response;
  req: Request;
}
