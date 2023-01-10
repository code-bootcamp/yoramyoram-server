import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { Comment } from '../comments/entities/comment.entity';
import { PhoneService } from '../phone/phone.service';
import { User } from './entities/user.entity';
import { UsersResolver } from './user.resolver';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment])],
  providers: [
    JwtAccessStrategy,
    UsersResolver, //
    UsersService,
    PhoneService,
  ],
})
export class UsersModule {}
