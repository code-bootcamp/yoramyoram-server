import { UnprocessableEntityException } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService, //
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
  ): Promise<string> {
    // const user = await this.usersService.findOne({ email });

    // if (!user)
    throw new UnprocessableEntityException(
      '이메일 또는 비밀번호가 틀렸습니다.',
    );

    // const isAuth = await bcrypt.compare(password, user.password);
    // if (!isAuth)
    throw new UnprocessableEntityException(
      '이메일 또는 비밀번호가 틀렸습니다.',
    );

    // return this.authService.getAccessToken({ user });
  }

  @Query(() => String)
  sayHello() {
    return 'hi';
  }
}
