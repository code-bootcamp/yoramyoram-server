import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { IProductsServiceCreate } from './interfaces/products-service.interface';
import { ProductCategory } from '../productsCategories/entities/productCategory.entity';

@Injectable()
export class ProductsService {
  //DI
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(ProductCategory)
    private readonly productsCategoriesRepository: Repository<ProductCategory>,
  ) {}

  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    const { productCategoryId, ...product } = createProductInput;

    const category = await this.productsCategoriesRepository.findOne({
      where: { category_id: productCategoryId },
    });
    if (!category)
      throw new UnprocessableEntityException(
        '상품카테고리와 함께 상품을 등록해주세요.',
      );

    //제품등록
    const result = await this.productsRepository.save({
      ...product,
      // productImage: result,
      productCategory: { category_id: productCategoryId },
    });

    return result;
  }
}
