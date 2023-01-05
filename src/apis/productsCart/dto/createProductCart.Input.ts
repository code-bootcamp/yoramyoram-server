import { Field, InputType, Int } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { User } from 'src/apis/user/entities/user.entity';

@InputType()
export class createProductCartInput {
  @Field(() => Int)
  quantity: number;

  @Field(() => User)
  user: User;

  @Field(() => Product)
  product: Product;
}
