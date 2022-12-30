import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductWishlist } from './entities/productWishlist.entity';

export class ProductWishlistService {
  constructor(
    @InjectRepository(ProductWishlist)
    private readonly productWishlistRepository: Repository<ProductWishlist>,
  ) {}

  async createWish({ user, productID }) {
    //   //---------------------------------------예외 처리부분--------------------------------------
    //   // 위시리스트 레포지토리에서 프로덕트위시리스트 아이디 가져와서 유저아이디랑 프로덕트아이디 같으면 추가x
    //   const existedWishlist = await this.productWishlistRepository.findOne({
    //     where: { product: productID },
    //   });
    //   if (existedWishlist.includes(user) && existedWishlist.includes(productID)) {
    //     return;
    //   }

    //   //---------------------------------------------------------------------------------------
    const result = await this.productWishlistRepository.save({
      user,
      productID,
    });
    return result;
  }

  findAll(): Promise<ProductWishlist[]> {
    return this.productWishlistRepository.find({});
  }

  //-------------------------*삭제*----------------------------//
  async delete({ productWishlistId }) {
    const result = await this.productWishlistRepository.softDelete({
      productwishlist_id: productWishlistId,
    });
    return result.affected ? true : false;
  }
}
