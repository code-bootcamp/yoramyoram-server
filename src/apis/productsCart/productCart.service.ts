import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
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

  async create({
    context,
    product_id,
    quantity,
    etc1Name,
    etc1Value,
    etc2Name,
    etc2Value,
  }) {
    const isProduct = await this.productCartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.product', 'product')
      .where('userId =:userId', { userId: context.req.user.id })
      .andWhere('productProductId =:productProductId ', {
        productProductId: product_id,
      })
      .getOne();

    const user = await this.userRepository.findOne({
      where: { id: context.req.user.id },
    });

    const product = await this.productsRepository.findOne({
      where: { product_id: product_id },
    });

    let result;
    if (!isProduct) {
      //상품이 장바구니에 없으면 카트에 추가
      result = await this.productCartRepository.save({
        user: context.req.user.id,
        product: product_id,
        quantity: quantity > 1 ? quantity : 1,
        etc1Name: etc1Name !== null ? etc1Name : '',
        etc1Value: etc1Value !== null ? etc1Value : '',
        etc2Name: etc2Name !== null ? etc2Name : '',
        etc2Value: etc2Value !== null ? etc2Value : '',
      });

      //유저테이블의 장바구니total금액도 추가
      await this.userRepository.save({
        id: user.id,
        cartTotal: user.cartTotal + product.price * quantity,
      });
    } else {
      //상품이 장바구니에 이미 있으면 갯수 올려주기
      result = await this.productCartRepository.save({
        id: isProduct.id,
        quantity:
          quantity > 1 ? isProduct.quantity + quantity : isProduct.quantity + 1,
        etc1Name: etc1Name !== null ? etc1Name : '',
        etc1Value:
          etc1Name !== null ? isProduct.etc1Value + `,${etc1Value}` : '',
        etc2Name: etc2Name !== null ? etc2Name : '',
        etc2Value:
          etc2Name !== null ? isProduct.etc2Value + `,${etc2Value}` : '',
      });

      this.userRepository.save({
        id: user.id,
        cartTotal: user.cartTotal + product.price * quantity,
      });
    }
    return result;
  }

  //로그인한 유저의 장바구니 목록 보여주기

  async fetchCart({ user: _user, page }) {
    const cart = await this.productCartRepository.find({
      where: { user: { id: _user.id } },
      relations: ['product', 'user', 'product.productImages'],
      take: 5,
      skip: (page - 1) * 5,
    });

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

  async findTotalAmount({ user: _user }) {
    const user = await this.productCartRepository
      .createQueryBuilder()
      .where('userId =:userId', { userId: _user.id })
      .getMany();

    const result = await Promise.all(
      user.map((el) => {
        return this.productCartRepository.findOne({
          where: { id: el.id },
          relations: ['product', 'user', 'product.productImages'],
        });
      }),
    );

    let sum = 0;
    for (let i = 0; i < result.length; i++) {
      sum += Number(result[i].quantity) * Number(result[i].product.price);
    }
    return sum;
  }

  async delete({ context, productCartId }) {
    const cart = await this.productCartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.product', 'product')
      .where('userId =:userId', { userId: context.req.user.id })
      .andWhere('id =:id ', {
        id: productCartId,
      })
      .getOne();

    const user = await this.userRepository.findOne({
      where: { id: context.req.user.id },
    });

    this.userRepository.save({
      id: user.id,
      cartTotal:
        user.cartTotal - Number(cart.quantity) * Number(cart.product.price),
    });

    const result = await this.productCartRepository.delete({
      id: cart.id,
    });
    return result.affected ? true : false;
  }
}
