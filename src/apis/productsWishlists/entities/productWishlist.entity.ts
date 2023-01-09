import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
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

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Product)
  @Field(() => Product)
  product: Product;
}
