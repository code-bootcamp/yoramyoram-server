import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductWishlist } from './entities/productWishlist.entity';
import { ProductWishlistResolver } from './productWishlist.resolver';
import { ProductWishlistService } from './productWishlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductWishlist])],
  providers: [ProductWishlistResolver, ProductWishlistService],
})
export class ProductWishlistModule {}
