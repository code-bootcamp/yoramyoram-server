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

  // 같은 유저아이디, 같은프로덕트아이디꺼 위시리스트 아이디 계속 다르게 저장됨 예외처리 필요
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ProductWishlist)
  async addWishlist(
    @Args('userID') user: string, //
    @Args('productID') productID: string,
  ) {
    return this.productWishlistService.createWish({
      user,
      productID,
    });
  }

  @Mutation(() => Boolean)
  deleteMyWishlist(
    @Args('ProductWishlistId') productWishlistId: string, //
  ) {
    return this.productWishlistService.delete({ productWishlistId });
  }
}
