import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductTag } from 'src/apis/productsTags/entities/productTag.entity';
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

  @Column()
  @Field(() => String)
  description: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column({ default: false })
  @Field(() => Boolean)
  isDeleted: boolean;

  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory)
  productCategory: ProductCategory;

  @JoinTable()
  @ManyToMany(() => ProductTag, (productTags) => productTags.products)
  @Field(() => [ProductTag])
  productTags: ProductTag[];
}
