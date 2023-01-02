import { Module } from '@nestjs/common';
import { ProductImagesResolver } from './productsImages.resolver';
import { ProductsImagesService } from './productsImages.service';

@Module({
  providers: [ProductImagesResolver, ProductsImagesService],
})
export class productsImagesModule {}
