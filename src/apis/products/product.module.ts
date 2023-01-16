import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from '../productsCategories/entities/productCategory.entity';
import { ProductsResolver } from './product.resolver';
import { ProductsService } from './product.service';
import { Comment } from '../comments/entities/comment.entity';
import { ProductWishlist } from '../productsWishlists/entities/productWishlist.entity';
import { ProductImage } from '../productImages/entities/productImage.entity';
import { User } from '../user/entities/user.entity';
import { ProductCart } from '../productsCart/entities/productCart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductCategory,
      Comment,
      ProductCart,
      ProductWishlist,
      ProductImage,
      User,
    ]),
  ],
  providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
