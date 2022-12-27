import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInpput } from './dto/create-user.input';
import { User } from './entities/user.entity';

import { UsersService } from './user.service';

@Resolver()
export class UsersResolver {
  constructor(
    //
    private readonly userSerivice: UsersService,
  ) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInpput') createUserInpput: CreateUserInpput,
  ) {
    return await this.userSerivice.create({
      createUserInpput,
    });
  }

  @Query(() => String)
  async findUserEmail(
    @Args('name') name: string, //
    @Args('phone') phone: string,
  ) {
    return await this.userSerivice.findOne({ name, phone });
  }
}
