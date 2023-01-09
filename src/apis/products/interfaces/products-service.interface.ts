import { IContext } from 'src/commons/types/context';
import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { Product } from '../entities/product.entity';

export interface IProductsServiceCreate {
  createProductInput: CreateProductInput;
  context: IContext;
}

export interface IProductsServiceFindOne {
  productId: string;
}

export interface IProductsServiceUpdate {
  product: Product;
  updateProductInput: UpdateProductInput;
  context: IContext;
  // images: string[]
}
