import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { ProductWishlist } from './entities/productWishlist.entity';
import { ProductWishlistResolver } from './productWishlist.resolver';
import { ProductWishlistService } from './productWishlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductWishlist, Product, User])],
  providers: [ProductWishlistResolver, ProductWishlistService],
})
export class ProductWishlistModule {}
