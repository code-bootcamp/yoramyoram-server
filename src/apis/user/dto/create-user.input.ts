import { Field, InputType } from '@nestjs/graphql';
import { USER_ENUM } from '../entities/user.entity';

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

  @Field(() => USER_ENUM)
  role: string;
}
