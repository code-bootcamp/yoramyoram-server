import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
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
  title: string;

  @Column()
  @Field(() => String)
  detail: string;

  @Column()
  @Field(() => String)
  character: string;

  @Column({ default: '' })
  @Field(() => String)
  point: string;

  @Column({ default: '' })
  @Field(() => String)
  year: string;

  @Column({ default: false }) //default값
  @Field(() => Boolean)
  isFinished: boolean;

  @Column({ default: false })
  @Field(() => Boolean)
  isDeleted: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory)
  productCategory: ProductCategory;
}
