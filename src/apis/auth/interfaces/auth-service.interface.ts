import { User } from 'src/apis/user/entities/user.entity';

export interface IAuthServiceGetAccessToken {
  user: User;
}
