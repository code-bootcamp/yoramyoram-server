import { User } from 'src/apis/users/entities/user.entity';

export interface IAuthServiceGetAccessToken {
  user: User;
}
