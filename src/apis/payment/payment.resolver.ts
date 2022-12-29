import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { Repository } from 'typeorm';
import { IamportService } from '../iamport/iamport.service';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,

    private readonly iamportService: IamportService,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args('impUid') impUid: string, //
    @Args({ name: 'point', type: () => Int }) point: number,

    @Context() iauthUser: IContext,
  ) {
    const token = await this.iamportService.getToken();
    this.iamportService.checkPid({ impUid, point, token });

    this.paymentService.checkDuplicate({ impUid });
    const user = iauthUser.req.user;

    this.paymentService.create({
      impUid,
      point,
      user,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async canclePayment(
    @Args('impUid') impUid: string, // 로그인한 유저정보
    @Args({ name: 'point', type: () => Int }) point: number, //

    // @CurrentUser() currentUser : ICurrentUser
    @Context() iauthUser: IContext,
  ): Promise<Payment> {
    const user = iauthUser.req.user;
    //검증로직들!!

    // 1. 이미 취소된 건인지 확인

    await this.paymentService.checkCanaeled({ impUid });
    // 2.취소하기에 충분한 내 포인트 잔액 남아 있는지

    await this.paymentService.checkCanCelPayment({ impUid, user });
    // 3. 실제로 아임포트에 취소 요청

    const token = await this.iamportService.getToken();
    const canceledPoint = await this.iamportService.cancel({ impUid, token });
    // payment 테이블에 결제 취소 등록
    return await this.paymentService.cancel({
      impUid,
      point: canceledPoint,
      user,
    });
  }
}
