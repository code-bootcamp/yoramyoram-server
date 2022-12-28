import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { IContext } from 'src/commons/types/context';
import { GqlAuthRefreshGuard } from 'src/commons/auth/gql-auth.guard';
import { UsersService } from '../user/user.service';

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
    @Context() context: IContext,
  ): Promise<string> {
    // 1. 이메일이 일치하는 유저를 DB에서 찾기
    const user = await this.usersService.findOne({ email });

    // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?!
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    // 4. refreshToken(=JWT)을 만들어서 프론트엔드 브라우저 쿠키에 저장해서 보내주기
    this.authService.setRefreshToken({ user, res: context.res });

    // 5. 일치하는 유저도 있고, 비밀번호도 맞았다면?!
    //    => accessToken(=JWT)을 만들어서 브라우저에 전달하기
    return this.authService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAcessToken(
    @Context() context: IContext, //
  ): string {
    // accessToken(=JWT)을 만들어서 브라우저에 전달하기
    return this.authService.getAccessToken({ user: context.req.user });
  }
}
