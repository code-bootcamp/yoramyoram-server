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
import { Comment } from '../comments/entities/comment.entity';
import { ProductWishlist } from '../productsWishlists/entities/productWishlist.entity';

@Injectable()
export class ProductsService {
  //DI
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(ProductCategory)
    private readonly productsCategoriesRepository: Repository<ProductCategory>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(ProductWishlist)
    private readonly productWishListRepository: Repository<ProductWishlist>,
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
    return this.productsRepository.createQueryBuilder().withDeleted().getMany();
  }

  async sortByPriceASC() {
    const list = await this.productsRepository.find({
      order: {
        price: 'ASC',
      },
    });
    return list;
  }

  async sortByPriceDESC() {
    const list = await this.productsRepository.find({
      order: {
        price: 'DESC',
      },
    });
    return list;
  }

  async sortByCommentsASC() {
    const ManyComments = await this.commentRepository
      .createQueryBuilder()
      .select('productProductId, COUNT(productProductId) AS ManyComments')
      .groupBy('productProductId')
      .orderBy('ManyComments', 'ASC')
      .getRawMany();

    const result = ManyComments.map(async (el) => {
      return this.productsRepository.findOne({
        where: { product_id: el.productProductId },
        relations: ['productCategory', 'productTags'],
      });
    });
    return result;
  }

  async sortByCommentsDESC() {
    const ManyComments = await this.commentRepository
      .createQueryBuilder()
      .select('productProductId, COUNT(productProductId) AS ManyComments')
      .groupBy('productProductId')
      .orderBy('ManyComments', 'DESC')
      .getRawMany();

    const result = ManyComments.map(async (el) => {
      return this.productsRepository.findOne({
        where: { product_id: el.productProductId },
        relations: ['productCategory', 'productTags'],
      });
    });
    return result;
  }

  async sortByCreatedAtASC() {
    const list = await this.productsRepository
      .createQueryBuilder()
      .orderBy('createdAt', 'ASC')
      .getMany();
    return list;
  }

  async sortByCreatedAtDESC() {
    const list = await this.productsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    return list;
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
  async update({ product, updateProductInput }: IProductsServiceUpdate) {
    const { productCategoryId, ...products } = updateProductInput;
    const categoryResult = await this.productsCategoriesRepository.findOne({
      where: {
        category_id: productCategoryId,
      },
    });
    const result = this.productsRepository.save({
      ...product,
      productCategory: {
        ...categoryResult,
      },
      ...products,
    });
    return result;
  }
}
