import { ConsoleLogger } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
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

  // 낮은가격 순으로 상품조회
  @Query(() => [Product])
  async fetchProductsbyLowPrice(): Promise<Product[]> {
    const purelist = await this.productsService.findAllbydesc();

    const LowPriceList = purelist.sort(function (product1, product2) {
      const product1P = product1.price;
      const product2P = product2.price;
      if (product1P < product2P) {
        return -1;
      } else if (product1P > product2P) {
        return 1;
      }
      return 0;
    });

    return LowPriceList;
  }

  // 높은가격 순으로 상품조회
  @Query(() => [Product])
  async fetchProductsbyHigherPrice(): Promise<Product[]> {
    const purelist = await this.productsService.findAllbydesc();

    const HighPriceList = purelist.sort(function (product1, product2) {
      const product1P = product1.price;
      const product2P = product2.price;
      if (product1P > product2P) {
        return -1;
      } else if (product1P < product2P) {
        return 1;
      }
      return 0;
    });

    return HighPriceList;
  }

  //-------------------------*생성*----------------------------//
  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.create({ createProductInput });
  }

  //-------------------------*삭제*----------------------------//
  @Mutation(() => Boolean)
  deleteProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productsService.delete({ productId });
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
