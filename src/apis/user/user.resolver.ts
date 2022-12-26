import { Mutation, Resolver } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { UsersService } from './user.service';

@Resolver()
export class UsersResolver {
  constructor(
    //
    private readonly userSerivice: UsersService,
  ) {}

  @Mutation()
  async createUser({ CreateUserInpput }) {
    const { name, email, phone, password, address, add_detail, birth } =
      CreateUserInpput;

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userSerivice.create({
      name,
      email,
      phone,
      hashedPassword,
      address,
      add_detail,
      birth,
    });
  }
}
