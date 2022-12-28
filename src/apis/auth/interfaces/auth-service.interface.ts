import { Response } from 'express';
import { User } from 'src/apis/user/entities/user.entity';
import { IAuthUser } from 'src/commons/types/context';

export interface IAuthServiceGetAccessToken {
  user: User | IAuthUser['user'];
}

export interface IAuthServiceSetRefreshToken {
  user: User;
  res: Response;
}
