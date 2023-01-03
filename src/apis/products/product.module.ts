import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from '../productsCategories/entities/productCategory.entity';
import { ProductsResolver } from './product.resolver';
import { ProductsService } from './product.service';
import { Comment } from '../comments/entities/comment.entity';
import { ProductWishlist } from '../productsWishlists/entities/productWishlist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductCategory,
      Comment,
      ProductWishlist,
    ]),
  ],
  providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
