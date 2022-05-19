import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

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
    const fname = `userImage/${uuidv4()}`;
    const userImageURL: string = await new Promise((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(`${fname}/${file.filename}`).createWriteStream())
        .on('finish', () => resolve(`${file.filename}`))
        .on('error', (error) => reject(error));
    });
    const encodeURL = encodeURIComponent(userImageURL);

    const ImageURL = `https://storage.cloud.google.com/${bucket}/${fname}/${encodeURL}`;

    return ImageURL;
  }

  async projectImage({ file }: IUpload) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);
    const fname = `projectImage/${uuidv4()}`;
    const userImageURL: string = await new Promise((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(`${fname}/${file.filename}`).createWriteStream())
        .on('finish', () => resolve(`${file.filename}`))
        .on('error', (error) => reject(error));
    });
    const encodeURL = encodeURIComponent(userImageURL);

    const ImageURL = `https://storage.cloud.google.com/${bucket}/${fname}/${encodeURL}`;

    return ImageURL;
  }

  async projectFile({ file }: IUpload) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);
    const fname = `projectFile/${uuidv4()}`;
    const userFile: string = await new Promise((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(`${fname}/${file.filename}`).createWriteStream())
        .on('finish', () => resolve(`${file.filename}`))
        .on('error', (error) => reject(error));
    });
    const EncodeUserFile = encodeURIComponent(userFile);
    const FileURL = `https://storage.cloud.google.com/${bucket}/${fname}/${EncodeUserFile}`;
    return FileURL;
  }
}
