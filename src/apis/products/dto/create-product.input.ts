import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  price: number;

  @Field(() => String)
  description: string;

  @Field(() => [String])
  productImages: string[];

  @Field(() => String, { nullable: true })
  etc1Name: string;

  @Field(() => String, { nullable: true })
  etc1Value: string;

  @Field(() => String, { nullable: true })
  etc2Name: string;

  @Field(() => String, { nullable: true })
  etc2Value: string;

  @Field(() => String)
  detailContent: string;

  @Field(() => String)
  productCategoryId: string;
}
