import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum USER_ENUM {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

registerEnumType(USER_ENUM, {
  name: 'USER_ENUM',
});

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  // @Field(() => String)
  password: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  add_detail: string;

  @Column({ default: 0 })
  @Field(() => Int)
  cartTotal: number;

  @DeleteDateColumn()
  // @Field(() => Date)
  deleteAt: Date;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @Column({ default: 0 })
  @Field(() => Int)
  paid: number;

  @Column({ type: 'enum', enum: USER_ENUM })
  @Field(() => USER_ENUM)
  role: string;
}
