import { ConsoleLogger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Int, Context } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
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
  fetchProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Query(() => [Product])
  searchProducts(@Args('word') word: string): Promise<Product[]> {
    return this.productsService.searchAll({ word });
  }

  //조회(한개)
  @Query(() => Product)
  fetchProduct(@Args('productId') productId: string): Promise<Product> {
    return this.productsService.findOne({ productId });
  }

  //soft delete로 삭제된 데이터들도 모두 나오도록
  @Query(() => [Product])
  fetchProductsWithDeleted(): Promise<Product[]> {
    return this.productsService.findAllWithDelete();
  }

  @Query(() => [Product])
  sortByPriceASC() {
    return this.productsService.sortByPriceASC();
  }

  @Query(() => [Product])
  sortByPriceDESC() {
    return this.productsService.sortByPriceDESC();
  }

  @Query(() => [Product])
  sortByCommentsASC() {
    return this.productsService.sortByCommentsASC();
  }

  @Query(() => [Product])
  sortByCommentsDESC() {
    return this.productsService.sortByCommentsDESC();
  }

  @Query(() => [Product])
  sortByCreatedAtASC() {
    return this.productsService.sortByCreatedAtASC();
  }

  @Query(() => [Product])
  sortByCreatedAtDESC() {
    return this.productsService.sortByCreatedAtDESC();
  }

  //-------------------------*생성*----------------------------//
  @Mutation(() => Product)
  createProduct(
    @Context() context: IContext,
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.create({ createProductInput });
  }
  //-------------------------*삭제*----------------------------//
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteProduct(
    @Context() context: IContext,
    @Args('productId') productId: string, //
  ) {
    const user = context.req.user;
    return this.productsService.delete({ user, productId });
  }

  //-------------------------*업데이트*----------------------------//
  @Mutation(() => Product)
  async updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    const product = await this.productsService.findOne({ productId });

    return this.productsService.update({
      product,
      updateProductInput,
    });
  }
}
