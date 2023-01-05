import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';

import { User } from './entities/user.entity';
import { UsersResolver } from './user.resolver';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    JwtAccessStrategy,
    UsersResolver, //
    UsersService,
  ],
})
export class UsersModule {}
