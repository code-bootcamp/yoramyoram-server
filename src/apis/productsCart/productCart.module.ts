import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { ProductCart } from './entities/productCart.entity';
import { ProductCartResolver } from './productCart.resolver';
import { PorductCartService } from './productCart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      Product,
      ProductCart,
    ]),
  ],
  providers: [
    ProductCartResolver, //
    PorductCartService,
  ],
})
export class ProductCartModule {}
