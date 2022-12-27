import { Mutation, Resolver } from '@nestjs/graphql';

import { UsersService } from './user.service';

@Resolver()
export class UsersResolver {
  constructor(
    //
    private readonly userSerivice: UsersService,
  ) {}

  @Mutation()
  async createUser({ CreateUserInpput }) {
    return this.userSerivice.create({
      CreateUserInpput,
    });
  }
}
