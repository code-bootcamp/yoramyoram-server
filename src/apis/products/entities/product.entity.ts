import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Payment } from 'src/apis/payment/entities/payment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { ProductCategory } from '../../productsCategories/entities/productCategory.entity';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  product_id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column({ default: 0 })
  @Field(() => Int)
  wishListCount: number;

  @Column({ default: 0 })
  @Field(() => Int)
  commentCount: number;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  etc1Name: string;

  @Column()
  @Field(() => String)
  etc1Value: string;

  @Column()
  @Field(() => String)
  etc2Name: string;

  @Column()
  @Field(() => String)
  etc2Value: string;

  @Column()
  @Field(() => String)
  detailContent: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  // @Field(() => Date)
  createdAt: Date;

  @Column({ default: false })
  // @Field(() => Boolean)
  isDeleted: boolean;

  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory)
  productCategory: ProductCategory;

  @ManyToOne(() => Payment)
  @Field(() => Payment)
  payment: Payment;
}
