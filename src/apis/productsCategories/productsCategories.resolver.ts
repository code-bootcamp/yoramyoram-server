import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductCategory } from './entities/productCategory.entity';
import { ProductsCategoriesService } from './productCategories.service';

@Resolver()
export class ProductsCategoriesResolver {
  constructor(
    private readonly productsCategoriesService: ProductsCategoriesService,
  ) {}

  @Mutation(() => ProductCategory)
  createProductCategory(
    //
    @Args('name') name: string, //
  ): Promise<ProductCategory> {
    return this.productsCategoriesService.create({ name });
  }
}
