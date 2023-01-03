import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
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
  async fetchmyWishlist(): Promise<ProductWishlist[]> {
    return this.productWishlistService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async addWishlist(
    @Args('createProductWishInput')
    createProductWishInput: CreateProductWishInput,
  ) {
    return this.productWishlistService.createWish({
      createProductWishInput,
    });
  }
}
