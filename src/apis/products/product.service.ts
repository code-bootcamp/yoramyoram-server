import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import {
  IProductsServiceCreate,
  IProductsServiceFindOne,
  IProductsServiceUpdate,
} from './interfaces/products-service.interface';
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

  //-------------------------*조회*----------------------------//
  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['productCategory'],
    });
  }

  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { product_id: productId },
      relations: ['productCategory'],
    });
  }

  findAllWithDelete(): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder()
      .withDeleted() // 넣어주면 가져옴
      .getMany();
  }

  //-------------------------*생성*----------------------------//
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
      productCategory: { category_id: productCategoryId },
    });

    return result;
  }

  //-------------------------*삭제*----------------------------//
  async delete({ productId }) {
    const result = await this.productsRepository.softDelete({
      product_id: productId,
    });
    return result.affected ? true : false;
  }

  //-------------------------*업데이트*-----------------//
  update({
    product,
    updateProductInput,
  }: IProductsServiceUpdate): Promise<Product> {
    const result = this.productsRepository.save({
      ...product,
      ...updateProductInput,
    });

    return result;
  }
}
