import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';

import { AdminUser } from './entities/user.entity';
import { AdminUsersResolver } from './adminUser.resolver';
import { AdminUsersService } from './adminUser.service';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser, Product])],
  providers: [
    JwtAccessStrategy,
    AdminUsersResolver, //
    AdminUsersService,
  ],
})
export class AdminUsersModule {}
