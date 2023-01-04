import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { IImagesServiceUpload } from './interfaces/productsImages-service.interface';

@Injectable()
export class ProductsImagesService {
  async upload({ images }: IImagesServiceUpload): Promise<string[]> {
    const waitedFiles = await Promise.all(images);

    const bucket = process.env.GCP_BUCKET_NAME;
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: '/my-secret/gcp-file-storage.json',
    }).bucket(bucket);

    const results = await Promise.all(
      waitedFiles.map((el) => {
        return new Promise<string>((resolve, reject) => {
          el.createReadStream()
            .pipe(storage.file(el.filename).createWriteStream())
            .on('finish', () => {
              resolve(`${bucket}/${el.filename}`);
            })
            .on('error', () => {
              reject('이미지 업로드에 실패하였습니다');
            });
        });
      }),
    );

    return results;
  }
}
