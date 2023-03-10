import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { ProductWishlist } from './entities/productWishlist.entity';

export class ProductWishlistService {
  constructor(
    @InjectRepository(ProductWishlist)
    private readonly productWishlistRepository: Repository<ProductWishlist>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createWish({ context, createProductWishInput }) {
    const { productId } = createProductWishInput;
    const userId = context.req.user.id;
    const isDib = await this.productWishlistRepository
      .createQueryBuilder()
      .select()
      .where('userId = :userId', { userId: userId })
      .andWhere('productProductId = :productProductId', {
        productProductId: productId,
      })
      .getOne();

    let checkDib = false;
    console.log('checkDib은 ' + checkDib);
    if (isDib) {
      //이미 찜목록에 있다면
      await this.productWishlistRepository.save({
        productwishlist_id: isDib.productwishlist_id,
        product: { product_id: productId },
        user: { id: userId },
        isDib: isDib.isDib ? false : true,
      });
      checkDib = isDib.isDib ? false : true;
    } else {
      //처음클릭이라면
      await this.productWishlistRepository.save({
        product: { product_id: productId },
        user: { id: userId },
        isDib: true,
      });
      checkDib = true;
    }

    const product = await this.productRepository.findOne({
      where: { product_id: productId },
    });

    if (checkDib) {
      await this.productRepository.save({
        product_id: productId,
        wishListCount: product.wishListCount + 1,
      });
    } else {
      await this.productRepository.save({
        product_id: productId,
        wishListCount: product.wishListCount - 1,
      });
    }
    return checkDib;
  }

  async findAll({ context, page }): Promise<ProductWishlist[]> {
    const userId = context.req.user.id;

    const wishList = await this.productWishlistRepository.find({
      where: { user: { id: userId }, isDib: true },
      relations: ['product', 'user', 'product.productImages'],
      take: 5,
      skip: (page - 1) * 5,
      order: {
        createdAt: 'DESC',
      },
    });

    return wishList;
  }
}
