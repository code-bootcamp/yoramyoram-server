import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ProductsDetailImagesService } from './productDetailImages.service';

@Resolver()
export class ProductsDetailImagesResolver {
  constructor(
    private readonly productsDetailImagesService: ProductsDetailImagesService,
  ) {}

  @Mutation(() => [String])
  uploadDetailImage(
    @Args({ name: 'images', type: () => [GraphQLUpload] }) images: FileUpload[],
  ): Promise<string[]> {
    return this.productsDetailImagesService.upload({ images });
  }

  //{ "query": "mutation uploadImage($images: [Upload!]!) { uploadImage(images: $images) }", "variables": { "images": [null, null] } }
  //{ "0": ["variables.images.0"], "1": ["variables.images.1"] }
}
