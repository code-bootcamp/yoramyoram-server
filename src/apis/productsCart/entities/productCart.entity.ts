import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProductCart {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column({ default: 1 })
  @Field(() => Int)
  quantity: number;

  // @Column({ nullable: true })
  // @Field(() => String, { nullable: true })
  // etc1Name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  etc1Value: string;

  // @Column({ nullable: true })
  // @Field(() => String, { nullable: true })
  // etc2Name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  etc2Value: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Product)
  @Field(() => Product)
  product: Product;
}
