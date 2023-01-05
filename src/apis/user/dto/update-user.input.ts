import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class updateUserInput extends PartialType(CreateUserInput) {}
