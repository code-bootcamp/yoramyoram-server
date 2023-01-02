import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from '../productsCategories/entities/productCategory.entity';
import { ProductsResolver } from './product.resolver';
import { ProductsService } from './product.service';
import { ProductTag } from '../productsTags/entities/productTag.entity';
import { Comment } from '../comments/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory, ProductTag, Comment]),
  ],
  providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
