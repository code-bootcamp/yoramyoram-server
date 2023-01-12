import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { threadId } from 'worker_threads';
import { Product } from '../products/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { ProductCart } from './entities/productCart.entity';
import { PorductCartService } from './productCart.service';

@Resolver()
export class ProductCartResolver {
  constructor(private readonly productCartService: PorductCartService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ProductCart)
  async createProductCart(
    //
    @Context() context: IContext,
    @Args('productId') product_id: string,
    @Args('etc1Value') etc1Value: string,
    @Args('etc2Value') etc2Value: string,
  ) {
    return await this.productCartService.create({
      context,
      product_id,
      etc1Value,
      etc2Value,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProductCart])
  async fetchProductCart(
    @Context() context: IContext, //
  ) {
    const user = context.req.user;
    return await this.productCartService.fetchCart({ user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteProductCart(
    @Context() context: IContext,
    @Args('productCartId') productCartId: string,
  ) {
    return await this.productCartService.delete({ context, productCartId });
  } //
}
