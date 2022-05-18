import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { Storage } from '@google-cloud/storage';
import { stringify } from 'querystring';

interface IUpload {
  file: FileUpload;
}

@Injectable()
export class FileService {
  async ImageUpload({ file }: IUpload) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);

    const userImageURL: string = await new Promise((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(file.filename).createWriteStream())
        .on('finish', () => resolve(`${bucket}/${file.filename}`))
        .on('error', (error) => reject(error));
    });
    console.log(encodeURIComponent(userImageURL));
    const encodeURL = encodeURIComponent(userImageURL);

    const ImageURL = `https://storage.cloud.google.com/${encodeURL}`;

    return ImageURL;
  }
}
