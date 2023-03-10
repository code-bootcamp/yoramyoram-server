import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { CreateProductWishInput } from './dto/create-productwishlist.input';
import { ProductWishlist } from './entities/productWishlist.entity';
import { ProductWishlistService } from './productWishlist.service';

@Resolver()
export class ProductWishlistResolver {
  constructor(
    private readonly productWishlistService: ProductWishlistService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProductWishlist])
  async fetchmyWishlist(
    @Context() context: IContext,
    @Args('page') page: number,
  ): Promise<ProductWishlist[]> {
    return this.productWishlistService.findAll({ context, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async addWishlist(
    @Context() context: IContext,
    @Args('createProductWishInput')
    createProductWishInput: CreateProductWishInput,
  ) {
    return this.productWishlistService.createWish({
      context,
      createProductWishInput,
    });
  }
}
