import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import {
  IProductsServiceCreate,
  IProductsServiceFindOne,
  IProductsServiceUpdate,
} from './interfaces/products-service.interface';
import { ProductCategory } from '../productsCategories/entities/productCategory.entity';
import { ProductWishlist } from '../productsWishlists/entities/productWishlist.entity';
import { ProductImage } from '../productImages/entities/productImage.entity';
import { User } from '../user/entities/user.entity';

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

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  //-------------------------*조회*----------------------------//
  async findAll({ cateId, page }): Promise<Product[]> {
    let products = [];
    if (cateId) {
      products = await this.productsRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.productImages', 'productImages')
        .where('productCategoryCategoryId = :productCategoryCategoryId', {
          productCategoryCategoryId: cateId,
        })
        .orderBy('createdAt', 'DESC')
        .getMany();

      if (products.length > 12) {
        const pageNum = Math.ceil(products.length / 12);
        const result = new Array(pageNum);
        for (let i = 0; i < pageNum; i++) {
          result[i] = products.slice(i * 12, (i + 1) * 12);
        }
        return result[page - 1];
      }
      return products;
    } else {
      products = await this.productsRepository.find({
        take: 12,
        skip: (page - 1) * 12,
        relations: ['productCategory', 'productImages'],
        order: {
          createdAt: 'DESC',
        },
      });
      return products;
    }
  }

  async findAllCount({ cateId }): Promise<number> {
    let products = [];
    if (cateId) {
      products = await this.productsRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.productImages', 'productImages')
        .where('productCategoryCategoryId = :productCategoryCategoryId', {
          productCategoryCategoryId: cateId,
        })
        .getMany();
    } else {
      products = await this.productsRepository.find({
        relations: ['productCategory', 'productImages'],
      });
    }

    return products.length;
  }

  async searchAll({ word, page }): Promise<Product[]> {
    const products = await this.productsRepository.find({
      where: { name: Like(`%${word}%`) },
      relations: ['productCategory', 'productImages'],
      order: {
        createdAt: 'DESC',
      },
    });

    if (products.length > 12) {
      const pageNum = Math.ceil(products.length / 12);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = products.slice(i * 12, (i + 1) * 12);
      }
      // console.log(result[0].length, result[1].length);
      return result[page - 1];
    }
    return products;
  }

  async searchAllCount({ word }): Promise<number> {
    const products = await this.productsRepository.find({
      where: { name: Like(`%${word}%`) },
      relations: ['productCategory', 'productImages'],
    });

    return products.length;
  }

  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { product_id: productId },
      relations: ['productCategory', 'productImages'],
    });
  }

  async sortByPriceASC({ page }) {
    const list = await this.productsRepository.find({
      take: 12,
      skip: (page - 1) * 12,
      order: {
        price: 'ASC',
      },
    });
    return list;
  }

  async sortByPriceDESC({ page }) {
    const list = await this.productsRepository.find({
      take: 12,
      skip: (page - 1) * 12,
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
      .take(12)
      .skip((page - 1) * 12)
      .groupBy('product_id')
      .orderBy('commentCount', 'ASC')
      .getRawMany();

    const products = ManyComments.map(async (el) => {
      return this.productsRepository.findOne({
        where: { product_id: el.product_id },
        relations: ['productCategory', 'productImages'],
      });
    });

    if (products.length > 12) {
      const pageNum = Math.ceil(products.length / 12);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = products.slice(i * 12, (i + 1) * 12);
      }
      return result[page - 1];
    }
    return products;
  }

  async sortByCommentsDESC({ page }) {
    const ManyComments = await this.productsRepository
      .createQueryBuilder()
      .select('product_id, name, commentCount')
      .take(12)
      .skip((page - 1) * 12)
      .groupBy('product_id')
      .orderBy('commentCount', 'DESC')
      .getRawMany();

    const result = ManyComments.map(async (el) => {
      return this.productsRepository.findOne({
        where: { product_id: el.product_id },
        relations: ['productCategory', 'productImages'],
      });
    });
    return result;
  }

  //-------------------------*생성*----------------------------//
  async create({
    createProductInput,
    context,
  }: IProductsServiceCreate): Promise<Product> {
    const { productImages, productCategoryId, etc1Name, etc2Name, ...product } =
      createProductInput;

    const user = await this.usersRepository.findOne({
      //
      where: { id: context.req.user.id },
    });

    if (user.role !== 'ADMIN') {
      throw new ConflictException('관리권한이 없습니다');
    }

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
      etc1Name: etc1Name === '옵션을 선택하세요.' ? '' : etc1Name,
      etc2Name: etc2Name === '옵션을 선택하세요.' ? '' : etc2Name,
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
  async delete({ context, productId }) {
    const user = await this.usersRepository.findOne({
      //
      where: { id: context.req.user.id },
    });
    if (user.role !== 'ADMIN') {
      throw new ConflictException('관리권한이 없습니다');
    }

    await this.productImageRepository.delete({
      product: productId,
    });

    const result = await this.productsRepository.delete({
      product_id: productId,
    });

    return result.affected ? true : false;
  }

  //-------------------------*업데이트*-----------------//
  async update({
    context,
    product,
    updateProductInput,
  }: IProductsServiceUpdate) {
    const { productImages, productCategoryId, ...rest } = updateProductInput;

    const user = await this.usersRepository.findOne({
      //
      where: { id: context.req.user.id },
    });
    if (user.role !== 'ADMIN') {
      throw new ConflictException('관리권한이 없습니다');
    }

    const categoryResult = await this.productsCategoriesRepository.findOne({
      where: {
        category_id: productCategoryId,
      },
    });
    const result = await this.productsRepository.save({
      product_id: product.product_id,
      ...rest,
      productCategory: {
        ...categoryResult,
      },
    });

    if (productImages) {
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
    }

    return result;
  }
}
