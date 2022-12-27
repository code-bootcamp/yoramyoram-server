//그래프큐엘과 연결할때 쓴다

import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  price: number;

  @Field(() => String)
  description: string;

  @Field(() => String)
  productCategoryId: string;
}
