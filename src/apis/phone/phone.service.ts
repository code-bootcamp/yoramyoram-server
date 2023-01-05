import { Injectable, NotFoundException } from '@nestjs/common';
import coolsms from 'coolsms-node-sdk';

@Injectable()
export class PhoneService {
  sendToken({ phone, Token }) {
    try {
      const text = `[YoramYoram] 인증번호 ${Token}을 입력해주세요`;

      const SMS_KEY = process.env.SMS_KEY;
      const SMS_SECRET = process.env.SMS_SECRET;
      const SMS_SENDER = process.env.SMS_SENDER;

      const messageService = new coolsms(SMS_KEY, SMS_SECRET);

      const result = messageService.sendOne({
        to: phone,
        from: SMS_SENDER,
        text,
        type: 'SMS',
        autoTypeDetect: false,
      });
      console.log(result);
      return '인증번호 전송 완료';
    } catch (error) {
      throw new NotFoundException('인증번호 전송에 실패하였습니다.');
    }
  }

  checkPhone({ phone }) {
    if (phone.length !== 10 && phone.length !== 11) {
      throw new NotFoundException('핸드폰 번호를 제대로 입력해주세요 ');
      return false;
    } else {
      return true;
    }
  }

  createToken() {
    const Token = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    return Token;
  }
}
