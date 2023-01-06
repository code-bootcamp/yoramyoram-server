import { Module } from '@nestjs/common';
import { AdminAuthResolver } from './admin.auth.resolver';
import { AdminAuthService } from './admin.auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { AdminUser } from '../adminUser /entities/user.entity';
import { AdminUsersService } from '../adminUser /adminUser.service';
import { JwtAdminStrategy } from 'src/commons/auth/jwt-admin.strategy';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      AdminUser, //
    ]),
  ],
  providers: [
    JwtRefreshStrategy,
    AdminAuthResolver, //
    AdminAuthService,
    AdminUsersService,
    JwtAdminStrategy,
  ],
})
export class AdminAuthModule {}
