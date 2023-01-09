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
import { ProductImage } from '../productImages/entities/productImage.entity';

@Injectable()
export class ProductsService {
  //DI
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(ProductCategory)
    private readonly productsCategoriesRepository: Repository<ProductCategory>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    @InjectRepository(ProductWishlist)
    private readonly productWishListRepository: Repository<ProductWishlist>,
  ) {}

  //-------------------------*조회*----------------------------//
  findAll({ page }): Promise<Product[]> {
    return this.productsRepository.find({
      take: 10,
      skip: (page - 1) * 10,
      relations: ['productCategory'],
    });
  }

  async searchAll({ word, page }): Promise<Product[]> {
    const products = await this.productsRepository.findBy({
      name: Like(`%${word}%`),
    });

    if (products.length > 10) {
      const pageNum = Math.ceil(products.length / 10);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = products.slice(i * 10, (i + 1) * 10);
      }
      console.log(result[0].length, result[1].length);
      return result[page - 1];
    }
    return products;
  }

  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { product_id: productId },
      relations: ['productCategory'],
    });
  }

  findAllWithDelete(): Promise<Product[]> {
    return this.productsRepository.createQueryBuilder().withDeleted().getMany();
  }

  async sortByPriceASC({ page }) {
    const list = await this.productsRepository.find({
      take: 10,
      skip: (page - 1) * 10,
      order: {
        price: 'ASC',
      },
    });
    return list;
  }

  async sortByPriceDESC({ page }) {
    const list = await this.productsRepository.find({
      take: 10,
      skip: (page - 1) * 10,
      order: {
        price: 'DESC',
      },
    });
    return list;
  }

  async sortByCommentsASC({ page }) {
    const ManyComments = await this.productsRepository
      .createQueryBuilder()
      .select('product_id, name, commentCount')
      .take(10)
      .skip((page - 1) * 10)
      .groupBy('product_id')
      .orderBy('commentCount', 'ASC')
      .getRawMany();

    const products = ManyComments.map(async (el) => {
      return this.productsRepository.findOne({
        where: { product_id: el.product_id },
        relations: ['productCategory'],
      });
    });

    if (products.length > 10) {
      const pageNum = Math.ceil(products.length / 10);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = products.slice(i * 10, (i + 1) * 10);
      }
      return result[page - 1];
    }
    return products;
  }

  async sortByCommentsDESC({ page }) {
    const ManyComments = await this.productsRepository
      .createQueryBuilder()
      .select('product_id, name, commentCount')
      .take(10)
      .skip((page - 1) * 10)
      .groupBy('product_id')
      .orderBy('commentCount', 'DESC')
      .getRawMany();

    const result = ManyComments.map(async (el) => {
      return this.productsRepository.findOne({
        where: { product_id: el.product_id },
        relations: ['productCategory'],
      });
    });
    return result;
  }

  async sortByCreatedAtASC({ page }) {
    const products = await this.productsRepository.find({
      take: 10,
      skip: (page - 1) * 10,
      order: {
        createdAt: 'ASC',
      },
    });

    if (products.length > 10) {
      const pageNum = Math.ceil(products.length / 10);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = products.slice(i * 10, (i + 1) * 10);
      }
      return result[page - 1];
    }
    return products;
  }

  async sortByCreatedAtDESC({ page }) {
    const products = await this.productsRepository.find({
      take: 10,
      skip: (page - 1) * 10,
      order: {
        createdAt: 'DESC',
      },
    });

    if (products.length > 10) {
      const page = Math.ceil(products.length / 10);
      const result = new Array(page);
      for (let i = 0; i < page; i++) {
        result[i] = products.slice(i * 10, (i + 1) * 10);
      }
      return result[page - 1];
    }
    return products;
  }

  //-------------------------*생성*----------------------------//
  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    const { productImages, productCategoryId, ...product } = createProductInput;

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

    await Promise.all(
      productImages.map((el, i) => {
        return new Promise(async (resolve, reject) => {
          try {
            const newImage = await this.productImageRepository.save({
              url: el,
              isMain: i === 0 ? true : false,
              product: { product_id: result.product_id },
            });
            resolve(newImage);
          } catch (err) {
            reject(err);
          }
        });
      }),
    );

    return result;
  }

  //-------------------------*삭제*----------------------------//
  async delete({ user, productId }) {
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
    });
    return result;
  }
}
