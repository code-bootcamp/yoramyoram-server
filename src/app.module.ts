import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './apis/products/product.module';
import { AuthModule } from './apis/auth/auth.module';
import { ProductsCategoriesModule } from './apis/productsCategories/productsCategories.module';
import { UsersModule } from './apis/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { RedisClientOptions } from 'redis';
import { CommentsModule } from './apis/comments/comments.module';
import { PhoneModule } from './apis/phone/phone.module';
import { JwtAccessStrategy } from './commons/auth/jwt-access.strategy';
import { JwtRefreshStrategy } from './commons/auth/jwt-refresh.strategy';
import * as redisStore from 'cache-manager-redis-store';
import { PaymentModule } from './apis/payment/payment.module';
import { ProductWishlistModule } from './apis/productsWishlists/productWishlist.module';
import { AppController } from './app.controller';

import { ProductCartModule } from './apis/productsCart/productCart.module';

import { productsImagesModule } from './apis/productImages/productsImages.module';


@Module({
  imports: [
    productsImagesModule,
    CommentsModule,
    ProductsModule,
    AuthModule,
    ProductsCategoriesModule,
    ProductWishlistModule,
    ProductCartModule,
    UsersModule,
    PhoneModule,
    PaymentModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: [
          'http://localhost:3000',
          'https://yoramyoram-backend.shop',
          'https://yoramyoram.shop',
        ],
        credentials: true,
        exposedHeaders: ['Set-Cookie', 'Cookie'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: [
          'Access-Control-Allow-Headers',
          'Authorization',
          'X-Requested-With',
          'Content-Type',
          'Accept',
        ],
      },
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,

      // url: 'redis://10.6.144.3:6379',

      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
  ],

  controllers: [AppController],
  providers: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class AppModule {}
