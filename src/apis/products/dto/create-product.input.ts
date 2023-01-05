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
  etc1Name: string;

  @Field(() => String)
  etc1Value: string;

  @Field(() => String)
  etc2Name: string;

  @Field(() => String)
  etc2Value: string;

  @Field(() => String)
  detailContent: string;

  @Field(() => String)
  productCategoryId: string;
}
