import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductWishInput {
  @Field(() => String)
  productId: string;
}
