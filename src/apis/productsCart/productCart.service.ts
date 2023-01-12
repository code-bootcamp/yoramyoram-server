import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { ProductCart } from './entities/productCart.entity';

@Injectable()
export class PorductCartService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(ProductCart)
    private readonly productCartRepository: Repository<ProductCart>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //장바구니 생성하면서 같은 상품을 담으면 수량 증가

  async create({ context, product_id, etc1Value, etc2Value }) {
    const isProduct = await this.productCartRepository
      .createQueryBuilder()
      .select()
      .where('userId =:userId', { userId: context.req.user.id })
      .andWhere('productProductId =:productProductId ', {
        productProductId: product_id,
      })
      .getOne();

    //console.log(isProduct);

    let result;
    if (!isProduct) {
      result = await this.productCartRepository.save({
        user: context.req.user.id,
        product: product_id,
        etc1Value,
        etc2Value,
      });
    } else {
      result = await this.productCartRepository.save({
        id: isProduct.id,
        quantity: isProduct.quantity + 1,
      });
    }
    return result;
  }

  //로그인한 유저의 장바구니 목록 보여주기

  async fetchCart({ user: _user, page }) {
    const user = await this.productCartRepository
      .createQueryBuilder()
      .where('userId =:userId', { userId: _user.id })
      .getMany();

    const cart = user.map(async (el) => {
      return await this.productCartRepository.findOne({
        where: { id: el.id },
        relations: ['product', 'user', 'product.productImages'],
      });
    });

    if (cart.length > 5) {
      const pageNum = Math.ceil(cart.length / 5);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = cart.slice(i * 5, (i + 1) * 5);
      }
      // console.log(result[0].length, result[1].length);
      return result[page - 1];
    }
    return cart;
  }

  async findAllCount({ user: _user }): Promise<number> {
    const user = await this.productCartRepository
      .createQueryBuilder()
      .where('userId =:userId', { userId: _user.id })
      .getMany();

    const cart = user.map(async (el) => {
      return await this.productCartRepository.findOne({
        where: { id: el.id },
        relations: ['product', 'user', 'product.productImages'],
      });
    });

    return cart.length;
  }

  async delete({ context, productCartId }) {
    const product = await this.productCartRepository
      .createQueryBuilder()
      .select()
      .where('userId =:userId', { userId: context.req.user.id })
      .andWhere('id =:id ', {
        id: productCartId,
      })
      .getOne();

    const result = await this.productCartRepository.delete({
      id: product.id,
    });
    return result.affected ? true : false;
  }
}
