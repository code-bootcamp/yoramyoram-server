import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { User } from 'src/apis/user/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PAYMENT_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}

registerEnumType(PAYMENT_STATUS_ENUM, {
  name: 'PAYMENT_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  //어떤 임포트 아이디에 얼마를 결제되었는지 그리고 결재완료인지 취소인지 상태를 기록하기위한 컬럼
  @Column()
  @Field(() => String)
  impUid: string;

  @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM })
  @Field(() => PAYMENT_STATUS_ENUM)
  status: string;

  @Column()
  @Field(() => Int)
  point: number;

  @Column({ default: 1 })
  @Field(() => Int)
  amount: number;

  @Column()
  @Field(() => String)
  etc1?: string;

  @Column()
  @Field(() => String)
  etc2?: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  //   @JoinColumn()
  //   @OneToOne(() => Product)
  //   @Field(() => Product)
  //   product: Product;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
