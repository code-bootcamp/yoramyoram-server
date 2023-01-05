import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  add_detail: string;

  // @Field(() => String)
  // birth: string;
}
