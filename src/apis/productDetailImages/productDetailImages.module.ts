import { Module } from '@nestjs/common';
import { ProductsDetailImagesResolver } from './productDetailImages.resolver';
import { ProductsDetailImagesService } from './productDetailImages.service';

@Module({
  providers: [ProductsDetailImagesResolver, ProductsDetailImagesService],
})
export class productsDetailImagesModule {}
