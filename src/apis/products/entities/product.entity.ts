import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Payment } from 'src/apis/payment/entities/payment.entity';
import { ProductImage } from 'src/apis/productImages/entities/productImage.entity';
import { ProductCart } from 'src/apis/productsCart/entities/productCart.entity';
import { ProductWishlist } from 'src/apis/productsWishlists/entities/productWishlist.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
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

  @Column({ length: 1500 })
  @Field(() => String)
  description: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  etc1Name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  etc1Value: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  etc2Name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  etc2Value: string;

  @Column({ length: 1500 })
  @Field(() => String)
  detailContent: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  @Field(() => [ProductImage])
  productImages: ProductImage[];

  @OneToMany(() => ProductCart, (productCart) => productCart.product)
  @Field(() => ProductCart)
  productCart: ProductCart;

  @OneToMany(
    () => ProductWishlist,
    (productWishlist) => productWishlist.product,
  )
  @Field(() => [ProductWishlist])
  productWishlist: ProductWishlist[];

  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory)
  productCategory: ProductCategory;

  @ManyToOne(() => Payment)
  @Field(() => Payment)
  payment: Payment;
}
