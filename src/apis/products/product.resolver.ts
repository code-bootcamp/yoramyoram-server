import { ConsoleLogger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Int, Context } from '@nestjs/graphql';
import {
  GqlAdmminGuard,
  GqlAuthAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './product.service';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  //-------------------------*조회*----------------------------//

  @Query(() => [Product])
  fetchProducts(
    @Args('cateId', { nullable: true }) cateId: string,
    @Args('page', { nullable: true }) page: number,
  ): Promise<Product[]> {
    return this.productsService.findAll({ cateId, page });
  }

  @Query(() => Int)
  fetchProductsCount(
    @Args('cateId', { nullable: true }) cateId: string,
  ): Promise<number> {
    return this.productsService.findAllCount({ cateId });
  }

  @Query(() => [Product])
  searchProducts(
    @Args('word') word: string,
    @Args('page') page: number,
  ): Promise<Product[]> {
    return this.productsService.searchAll({ word, page });
  }

  @Query(() => Int)
  searchProductsCount(@Args('word') word: string): Promise<number> {
    return this.productsService.searchAllCount({ word });
  }

  //조회(한개)
  @Query(() => Product)
  fetchProduct(@Args('productId') productId: string): Promise<Product> {
    return this.productsService.findOne({ productId });
  }

  @Query(() => [Product])
  sortByPriceASC(@Args('page') page: number) {
    return this.productsService.sortByPriceASC({ page });
  }

  @Query(() => [Product])
  sortByPriceDESC(@Args('page') page: number) {
    return this.productsService.sortByPriceDESC({ page });
  }

  @Query(() => [Product])
  sortByCommentsASC(@Args('page') page: number) {
    return this.productsService.sortByCommentsASC({ page });
  }

  @Query(() => [Product])
  sortByCommentsDESC(@Args('page') page: number) {
    return this.productsService.sortByCommentsDESC({ page });
  }

  //-------------------------*생성*----------------------------//
  @UseGuards(GqlAdmminGuard)
  @Mutation(() => Product)
  createProduct(
    @Context() context: IContext,
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.create({ createProductInput, context });
  }
  //-------------------------*삭제*----------------------------//
  @UseGuards(GqlAdmminGuard)
  @Mutation(() => Boolean)
  deleteProduct(
    @Context() context: IContext,
    @Args('productId') productId: string, //
  ) {
    return this.productsService.delete({ context, productId });
  }

  //-------------------------*업데이트*----------------------------//
  @UseGuards(GqlAdmminGuard)
  @Mutation(() => Product)
  async updateProduct(
    @Context() context: IContext,
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    const product = await this.productsService.findOne({ productId });

    return this.productsService.update({
      context,
      product,
      updateProductInput,
    });
  }
}
