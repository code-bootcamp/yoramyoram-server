import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from '../productsCategories/entities/productCategory.entity';
import { ProductsResolver } from './product.resolver';
import { ProductsService } from './product.service';
import { ProductTag } from '../productsTags/entities/productTag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory, ProductTag,])],
  providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
