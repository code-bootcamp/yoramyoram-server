import {
  ConflictException,
  ConsoleLogger,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    // @InjectRepository(Comment)
    // private readonly commentRepository: Repository<Comment>,

    private readonly dataSource: DataSource,
  ) {}

  async checkDuplicate({ impUid }) {
    const result = await this.paymentRepository.findOne({ where: { impUid } });

    if (result) throw new ConflictException('이미 결제된 아이디입니다.');
  }

  async checkCanaeled({ impUid }) {
    const paymentStatus = await this.paymentRepository.findOne({
      where: {
        impUid,
        status: PAYMENT_STATUS_ENUM.CANCEL,
      },
    });
    if (paymentStatus) throw new ConflictException('이미취소된 결제 입니다');
  }

  //결제취소 할 수 있는 잔액화인
  async checkCanCelPayment({ impUid, user }) {
    const paymentCheck = await this.paymentRepository.findOne({
      where: {
        impUid,
        user: { id: user.id },
        status: PAYMENT_STATUS_ENUM.PAYMENT,
      },
    });
    if (!paymentCheck)
      throw new UnprocessableEntityException('결제 기록이 존재하지 않습니다.');

    const User = await this.usersRepository.findOne({ where: { id: user.id } });
    if (User.point < paymentCheck.point)
      throw new UnprocessableEntityException('결제금액이 부족합니다');
  }
  async cancel({ impUid, point, user: _user, etc1, etc2 }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const payment = this.paymentRepository.create({
        impUid,
        point,
        user: _user,
        status: PAYMENT_STATUS_ENUM.CANCEL,
        etc1,
        etc2,
      });
      const result = await queryRunner.manager.save(payment);

      // console.log('id' + _user.id);
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });
      // console.log('user' + user);
      await queryRunner.manager.update(
        User,
        { id: _user.id },
        {
          amount: user.amount - point,
          point: user.point - point * 0.1,
        },
      );
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async create({
    impUid,
    point,
    user: _user,
    status = PAYMENT_STATUS_ENUM.PAYMENT,
    etc1,
    etc2,
  }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    const payment = this.paymentRepository.create({
      impUid,
      point,
      user: _user,
      status,
      etc1,
      etc2,
    });

    try {
      const result = await queryRunner.manager.save(payment);

      // console.log('id' + _user.id);
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });
      // console.log('user' + user);
      await queryRunner.manager.update(
        User,
        { id: _user.id },
        {
          amount: user.amount + point,
          point: user.point + point * 0.1,
        },
      );
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
