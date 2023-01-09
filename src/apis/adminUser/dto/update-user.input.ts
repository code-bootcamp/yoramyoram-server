import { InputType, PartialType } from '@nestjs/graphql';
import { AdminCreateUserInput } from './create-user.input';

@InputType()
export class AdminupdateUserInput extends PartialType(AdminCreateUserInput) {}
