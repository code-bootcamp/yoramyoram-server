import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => Int)
  star: number;

  @Field(() => String)
  content: string;

  @Field(() => String)
  productId: string;

  // @Field(() => String)
  // paymentId: string;
}
