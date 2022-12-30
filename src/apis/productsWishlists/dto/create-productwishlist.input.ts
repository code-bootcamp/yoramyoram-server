import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductWishInput {
  @Field(() => String)
  product: string;

  @Field(() => String)
  user: string;
}
