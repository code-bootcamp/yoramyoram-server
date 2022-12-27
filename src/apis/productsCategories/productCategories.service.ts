import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/productCategory.entity';
import { IProductsCategoriesServiceCreate } from './interface/products-categories-service.interface';

export class ProductsCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoriesRepository: Repository<ProductCategory>,
  ) {}

  create({ name }: IProductsCategoriesServiceCreate): Promise<ProductCategory> {
    const result = this.productCategoriesRepository.save({ category: name });

    return result;
  }
}
