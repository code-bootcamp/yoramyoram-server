import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

import { UsersService } from './user.service';

@Resolver()
export class UsersResolver {
  constructor(
    //
    private readonly userSerivice: UsersService,
  ) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userSerivice.create({
      createUserInput,
    });
  }

  @Query(() => String)
  async findUserEmail(
    @Args('name') name: string, //
    @Args('phone') phone: string,
  ) {
    return await this.userSerivice.emailFindOne({ name, phone });
  }

  @Mutation(() => Boolean)
  deleteUser(
    @Args('userId') userId: string, //
  ) {
    return this.userSerivice.delete({ userId });
  }
}
