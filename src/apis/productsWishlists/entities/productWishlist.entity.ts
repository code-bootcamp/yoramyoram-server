import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProductWishlist {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  productwishlist_id: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isDib: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Product, (product) => product.productWishlist)
  @Field(() => Product)
  product: Product;
}
