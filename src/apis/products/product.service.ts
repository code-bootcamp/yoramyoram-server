import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import {
  IProductsServiceCreate,
  IProductsServiceFindOne,
  IProductsServiceUpdate,
} from './interfaces/products-service.interface';
import { ProductCategory } from '../productsCategories/entities/productCategory.entity';
import { ProductTag } from '../productsTags/entities/productTag.entity';

@Injectable()
export class ProductsService {
  //DI
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(ProductCategory)
    private readonly productsCategoriesRepository: Repository<ProductCategory>,

    @InjectRepository(ProductTag)
    private readonly productsTagsRepository: Repository<ProductTag>,
  ) {}

  //-------------------------*조회*----------------------------//
  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['productCategory', 'productTags'],
    });
  }
  
  
  async searchAll({ word }): Promise<Product[]> {
    return await this.productsRepository.findBy({
      name: Like(`%${word}%`),
    });
  }
  
  
  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { product_id: productId },
      relations: ['productCategory', 'productTags'],
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
    const { productCategoryId, productTags, ...product } = createProductInput;

    const category = await this.productsCategoriesRepository.findOne({
      where: { category_id: productCategoryId },
    });
    if (!category)
      throw new UnprocessableEntityException(
        '상품카테고리와 함께 상품을 등록해주세요.',
      );

    const temp = [];
    for (let i = 0; i < productTags.length; i++) {
      const tagname = productTags[i].replace('#', '');

      const prevTag = await this.productsTagsRepository.findOne({
        where: { name: tagname },
      });

      if (prevTag) {
        temp.push(prevTag);
      } else {
        const newTag = await this.productsTagsRepository.save({
          name: tagname,
        });
        console.log(newTag);
        temp.push(newTag);
      }
    }

    console.log(temp);

    //제품등록
    const result = await this.productsRepository.save({
      ...product,
      productCategory: { category_id: productCategoryId },
      productTags: temp,
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
  async update({ product, updateProductInput }: IProductsServiceUpdate) {
    const { productCategoryId, productTags, ...products } = updateProductInput;
    const categoryResult = await this.productsCategoriesRepository.findOne({
      where: {
        category_id: productCategoryId,
      },
    });
    const temp = [];
    for (let i = 0; i < productTags.length; i++) {
      const tagname = productTags[i].replace('#', '');
      const prevTag = await this.productsTagsRepository.findOne({
        where: { name: tagname },
      });
      if (prevTag) {
        temp.push(prevTag);
      } else {
        const newTag = await this.productsTagsRepository.save({
          name: tagname,
        });
        console.log(newTag);
        temp.push(newTag);
      }
    }
    const result = this.productsRepository.save({
      ...product,
      productTags: temp,
      productCategory: {
        ...categoryResult,
      },
      ...products,
    });
    return result;
  }
}
