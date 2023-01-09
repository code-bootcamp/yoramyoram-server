import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';

export class JwtAdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    console.log(payload);
    const access_token = req.headers.authorization.replace('Bearer ', '');

    const result = await this.cacheManager.get(`access_token:${access_token}`);
    console.log(result);
    if (result === 'accessToken') {
      throw new UnauthorizedException('이미 로그아웃된 토큰입니다.');
    }

    let result2;
    if (payload.role === 'ADMIN') {
      result2 = {
        role: payload.role,
        email: payload.email,
        id: payload.sub,
        exp: payload.exp,
      };
    } else {
      throw new ConflictException('관리권한이 없습니다');
    }
    return result2;
  }
}
