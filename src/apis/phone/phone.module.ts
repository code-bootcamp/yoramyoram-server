import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comments/entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/user.service';
import { PhoneResolver } from './phone.resolver';
import { PhoneService } from './phone.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment])],
  providers: [
    PhoneResolver, //
    PhoneService,
    UsersService,
  ],
})
export class PhoneModule {}
