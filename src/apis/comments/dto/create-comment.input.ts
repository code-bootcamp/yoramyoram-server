import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  title: string;

  @Field(() => Int)
  star: number;

  @Field(() => String)
  content: string;

  @Field(() => String)
  productId: string;

  @Field(() => String)
  userId: string;

  // @Field(() => String)
  // paymentId: string;
}
