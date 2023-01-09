import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  category_id: string;

  @Column({ unique: true })
  @Field(() => String)
  category: string;
}
