import {
  CACHE_MANAGER,
  Inject,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { UsersService } from '../user/user.service';
import { PhoneService } from './phone.service';

@Resolver()
export class PhoneResolver {
  constructor(
    private readonly phoneService: PhoneService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async sendTokentoPhone(
    @Args('phone') phone: string, //
  ) {
    try {
      //핸드폰 번호 규격 검증
      this.phoneService.checkPhone({ phone });

      const Token = this.phoneService.createToken();

      const sendToken = this.phoneService.sendToken({ phone, Token });
      await this.cacheManager.set(phone, Token, 300);
      this.cacheManager.get(phone).then((res) => console.log(res));

      return `${sendToken}`;
    } catch (error) {
      const checkUserPhone = this.usersService.findOnePhone({ phone });
      if (checkUserPhone) {
        throw new NotFoundException('이미 등록된 핸드폰번호입니다.');
      }
    }
  }

  @Mutation(() => String)
  async checkTokenPhone(
    @Args('phone') phone: string,
    @Args('phoneToken') phoneToken: string,
  ) {
    try {
      const cachePhoneToken = await this.cacheManager.get(phone);
      if (cachePhoneToken === phoneToken) {
        return '인증이 완료 되었습니다!';
      }
      await this.cacheManager.set(phone, true, 800);

      this.cacheManager.get(phone).then((res) => console.log(res));
    } catch (error) {
      const cachePhoneToken = await this.cacheManager.get(phone);

      if (cachePhoneToken !== phoneToken) {
        throw new Error('인증번호가 일치하지 않습니다.');
      }
    }
  }
}
