import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class AdminUser {
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

  // @Column()
  // @Field(() => String)
  // birth: string;

  @DeleteDateColumn()
  // @Field(() => Date)
  deleteAt: Date;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;
}
