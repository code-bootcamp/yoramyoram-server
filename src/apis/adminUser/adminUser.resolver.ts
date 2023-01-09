import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminCreateUserInput } from './dto/create-user.input';
import { AdminUser } from './entities/user.entity';
import { AdminUsersService } from './adminUser.service';
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GqlAdmminGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';

@Resolver()
export class AdminUsersResolver {
  constructor(
    //
    private readonly adminUsersService: AdminUsersService,

    @InjectRepository(AdminUser)
    private readonly AdminUsersRepository: Repository<AdminUser>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
  // ---- 회원가입 ----
  @Mutation(() => AdminUser)
  async createAdminUser(
    @Args('adminCreateUserInput') adminCreateUserInput: AdminCreateUserInput,
  ) {
    return await this.adminUsersService.create({
      adminCreateUserInput,
    });
  }

  // ---- 아이디 찾기 -----
  @Query(() => String)
  async findAdminUserEmail(
    @Args('name') name: string, //
    @Args('phone') phone: string,
  ) {
    return await this.adminUsersService.findOneEmail({ name, phone });
  }

  // ---- 로그인 유저정보 보기 ----
  @UseGuards(GqlAdmminGuard)
  @Query(() => AdminUser)
  fetchLoginAdminUser(@Context() context: IContext) {
    console.log(context.req.user);
    console.log(context.req.user.email);
    return this.adminUsersService.findLogin({ context });
  }

  // ---- 비밀번호 찾기 휴대폰 인증 ----
  @Mutation(() => String)
  async findAdminUserPassword(
    @Args('name') name: string,
    @Args('phone') phone: string,
    @Args('email') email: string,
    @Args('token') token: string,
  ) {
    const userPassword = await this.adminUsersService.findOnePassword({
      name,
      email,
    });
    if (userPassword.email !== email) return '가입한 이메일의 정보가 없습니다';

    const redisToken = await this.cacheManager.get(phone);
    if (redisToken !== token) {
      throw new Error('휴대폰 인증번호가 올바르지 않습니다');
    } else {
      return '인증인 성공하였습니다.';
    }
  }

  // ---- 비밀번호 재설정  ----

  @Mutation(() => String)
  updateAdminPassword(
    @Args('password') password: string,
    @Args('phone') phone: string,
  ) {
    return this.adminUsersService.updatePassword({ password, phone });
  }

  // ---- 회원 삭제 ----
  @UseGuards(GqlAdmminGuard)
  @Mutation(() => Boolean)
  deleteAdminUser(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;
    return this.adminUsersService.delete({ userId });
  }
}
