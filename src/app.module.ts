import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './apis/products/product.module';
import { AuthModule } from './apis/auth/auth.module';
import { ProductsCategoriesModule } from './apis/productsCategories/productsCategories.module';
import { UsersModule } from './apis/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './apis/comments/comments.module';
import { PhoneModule } from './apis/phone/phone.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    CommentsModule,
    ProductsModule,
    AuthModule,
    ProductsCategoriesModule,
    UsersModule,
    PhoneModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
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
      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
