<<<<<<< HEAD
import { Field, ObjectType } from '@nestjs/graphql';
=======
import { Field, Int, ObjectType } from '@nestjs/graphql';
>>>>>>> develop
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
<<<<<<< HEAD
=======
  CreateDateColumn,
>>>>>>> develop
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
<<<<<<< HEAD
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
=======
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
>>>>>>> develop

  @Column({ default: false })
  @Field(() => Boolean)
  isDeleted: boolean;

<<<<<<< HEAD
  @DeleteDateColumn()
  deletedAt: Date;

=======
>>>>>>> develop
  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory)
  productCategory: ProductCategory;
}
