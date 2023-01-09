import {
  CACHE_MANAGER,
  Inject,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { AdminAuthService } from './admin.auth.service';
import { IContext } from 'src/commons/types/context';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import { AdminUsersService } from '../adminUser /adminUser.service';

@Resolver()
export class AdminAuthResolver {
  constructor(
    private readonly adminUsersService: AdminUsersService, //
    private readonly adminAuthService: AdminAuthService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async adminLogin(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ): Promise<string> {
    // 1. 이메일이 일치하는 유저를 DB에서 찾기
    const adminUser = await this.adminUsersService.findOne({ email });

    // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
    if (!adminUser)
      throw new UnprocessableEntityException('이메일이 없습니다.');

    // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?!
    const isAuth = await bcrypt.compare(password, adminUser.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    // 4. refreshToken(=JWT)을 만들어서 프론트엔드 브라우저 쿠키에 저장해서 보내주기
    this.adminAuthService.setRefreshToken({
      adminUser,
      res: context.res,
      req: context.req,
    });

    // 5. 일치하는 유저도 있고, 비밀번호도 맞았다면?!
    //    => accessToken(=JWT)을 만들어서 브라우저에 전달하기
    return this.adminAuthService.getAccessToken({ adminUser });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ): string {
    // accessToken(=JWT)을 만들어서 브라우저에 전달하기
    return this.adminAuthService.getAccessToken({
      adminUser: context.req.user,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(
    @Context() context: IContext, //
  ) {
    const refresh_token = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );
    const access_token = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    console.log(refresh_token);

    try {
      const decoded = jwt.verify(access_token, process.env.JWT_ACCESS_KEY);
      await this.cacheManager.set(
        `access_token:${access_token}`,
        'accessToken',
        context.req.user.exp,
      );
      const decodedR = jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY);

      await this.cacheManager.set(
        `refresh_token:${refresh_token}`,
        'refreshToken',
        context.req.user.exp,
      );
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return '로그아웃에 성공하였습니다.';
  }
}
