import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  productImage_id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column()
  @Field(() => Boolean)
  isMain: boolean;

  @ManyToOne(() => Product, (product) => product.productImages)
  @Field(() => Product)
  product: Product;
}
