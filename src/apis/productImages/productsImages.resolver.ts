import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ProductsImagesService } from './productsImages.service';

@Resolver()
export class ProductImagesResolver {
  constructor(private readonly productsImagesService: ProductsImagesService) {}

  @Mutation(() => [String])
  uploadImage(
    @Args({ name: 'images', type: () => [GraphQLUpload] }) images: FileUpload[],
  ): Promise<string[]> {
    return this.productsImagesService.upload({ images });
  }

  //{ "query": "mutation uploadImage($images: [Upload!]!) { uploadImage(images: $images) }", "variables": { "images": [null, null] } }
  //{ "0": ["variables.images.0"], "1": ["variables.images.1"] }
}
