import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';
import {
  CACHE_MANAGER,
  ConsoleLogger,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';

@Resolver()
export class UsersResolver {
  constructor(
    //
    private readonly userSerivice: UsersService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
  // ---- 회원가입 ----
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userSerivice.create({
      createUserInput,
    });
  }

  // ---- 아이디 찾기 -----
  @Query(() => String)
  async findUserEmail(
    @Args('name') name: string, //
    @Args('phone') phone: string,
  ) {
    return await this.userSerivice.findOneEmail({ name, phone });
  }

  // ---- 로그인 유저정보 보기 ----
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchLoginUser(@Context() context: IContext) {
    console.log(context.req.user);
    console.log(context.req.user.email);
    return this.userSerivice.findLogin({ context });
  }

  // ---- 비밀번호 찾기 휴대폰 인증 ----
  @Mutation(() => String)
  async findUserPassword(
    @Args('name') name: string,
    @Args('phone') phone: string,
    @Args('email') email: string,
    @Args('token') token: string,
  ) {
    const userPassword = await this.userSerivice.findOnePassword({
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
  updatePassword(
    @Args('password') password: string,
    @Args('phone') phone: string,
  ) {
    return this.userSerivice.updatePassword({ password, phone });
  }

  // ---- 회원 삭제 ----
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;
    return this.userSerivice.delete({ userId });
  }
}
