import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { IImagesDetailServiceUpload } from './interfaces/productsDetailImages-service.interface';

@Injectable()
export class ProductsDetailImagesService {
  async upload({ images }: IImagesDetailServiceUpload): Promise<string[]> {
    const waitedFiles = await Promise.all(images);

    const bucket = 'yoram-storage';
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
