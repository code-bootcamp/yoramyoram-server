import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/user.service';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { JwtAdminStrategy } from 'src/commons/auth/jwt-admin.strategy';
import { Comment } from '../comments/entities/comment.entity';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      User, //
      Comment,
    ]),
  ],
  providers: [
    JwtRefreshStrategy,
    JwtAdminStrategy,
    AuthResolver, //
    AuthService,
    UsersService,
  ],
})
export class AuthModule {}
