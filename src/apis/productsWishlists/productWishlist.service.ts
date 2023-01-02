import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductWishlist } from './entities/productWishlist.entity';

export class ProductWishlistService {
  constructor(
    @InjectRepository(ProductWishlist)
    private readonly productWishlistRepository: Repository<ProductWishlist>,
  ) {}

  async createWish({ createProductWishInput }) {
    const { userId, productId } = createProductWishInput;
    const isDib = await this.productWishlistRepository
      .createQueryBuilder()
      .select()
      .where('userId = :userId', { userId: userId })
      .andWhere('productProductId = :productProductId', {
        productProductId: productId,
      })
      .getOne();

    let checkDib = false;
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
    return checkDib;
  }

  findAll(): Promise<ProductWishlist[]> {
    return this.productWishlistRepository.find({});
  }
}
