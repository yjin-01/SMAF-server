import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { Storage } from '@google-cloud/storage';

interface IUpload {
  file: FileUpload;
}

@Injectable()
export class FileService {
  async userImage({ file }: IUpload) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);

    const userImageURL: string = await new Promise((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(`userImage/${file.filename}`).createWriteStream())
        .on('finish', () => resolve(`${file.filename}`))
        .on('error', (error) => reject(error));
    });
    const encodeURL = encodeURIComponent(userImageURL);

    const ImageURL = `https://storage.cloud.google.com/${bucket}/userImage/${encodeURL}`;

    return ImageURL;
  }

  async projectImage({ file }: IUpload) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);

    const userImageURL: string = await new Promise((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(`projectImage/${file.filename}`).createWriteStream())
        .on('finish', () => resolve(`${file.filename}`))
        .on('error', (error) => reject(error));
    });
    const encodeURL = encodeURIComponent(userImageURL);

    const ImageURL = `https://storage.cloud.google.com/${bucket}/projectImage/${encodeURL}`;

    return ImageURL;
  }

  async projectFile({ file }: IUpload) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);

    const userFileURL: string = await new Promise((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(`projectFile/${file.filename}`).createWriteStream())
        .on('finish', () => resolve(`${file.filename}`))
        .on('error', (error) => reject(error));
    });
    console.log(userFileURL);
    return userFileURL;
  }
}
