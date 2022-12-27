//그래프큐엘과 연결할때 쓴다

import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  detail: string;

  @Field(() => String)
  character: string;

  @Field(() => String)
  point: string;

  @Field(() => String)
  year: string;

  @Field(() => String)
  productCategoryId: string;
}
