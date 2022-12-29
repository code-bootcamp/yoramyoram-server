import {
  ConflictException,
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import axios from 'axios';
import { async } from 'rxjs';
import { Repository } from 'typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { User } from '../user/entities/user.entity';

//try catchfh 예외처리
//발급 받은 get토큰 resolver로 return해서 다른 부분에서도 토큰을 쓸수 있게 해주기

@Injectable()
export class IamportService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getToken(): Promise<void> {
    try {
      const getToken = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post', // POST method
        headers: { 'Content-Type': 'application/json' },
        data: {
          imp_key: process.env.IMP_KEY,
          imp_secret: process.env.IMP_SECRET,
        },
      });

      return getToken.data.response.access_token;
    } catch (error) {
      error.response.data.message, error.response.status;
    }
  }

  async checkPid({ impUid, token, point }) {
    const imp_uid = impUid;
    try {
      const getPaymentData = await axios({
        url: `https://api.iamport.kr/payments/${imp_uid}`,
        method: 'get',
        headers: {
          Authorization: token,
        },
      });

      if (getPaymentData.data.response.status !== 'paid')
        throw new ConflictException('결제 내역이 존재하지 않습니다');

      if (getPaymentData.data.response.amount !== point)
        throw new UnprocessableEntityException('결제 금액이 잘못 되었습니다');
    } catch (error) {
      if (error?.getPaymentData?.data?.message) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        throw error;
      }
    } finally {
    }
  }

  async cancel({ impUid, token }) {
    try {
      // await axios({
      //   url: 'https://api.iamport.kr/payments/cancel',
      //   method: 'post',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: token, // 아임포트 서버로부터 발급받은 엑세스 토큰
      //   },
      //   data: {
      //     imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
      //     amount: amount, // 가맹점 클라이언트로부터 받은 환불금액
      //   },
      // })

      const result = await axios.post(
        'https://api.iamport.kr/payments/cancel',
        { imp_uid: impUid },
        { headers: { Authorization: token } },
      );

      return result.data.response.cancel_amount;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      );
    }
  }
}
