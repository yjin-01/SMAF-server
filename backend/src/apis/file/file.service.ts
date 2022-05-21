import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { resolve } from 'path';
import { rejects } from 'assert';

interface IUpload {
  file: FileUpload[];
}

@Injectable()
export class FileService {
  async userImage({ file }: IUpload) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);
    const files = await Promise.all(file);

    const result = await Promise.all(
      files.map((el) => {
        return new Promise((resolve, reject) => {
          const fname = `userImage/${uuidv4()}`;
          const EncodeUserFile = encodeURIComponent(el.filename);
          el.createReadStream()
            .pipe(storage.file(`${fname}/${el.filename}`).createWriteStream())
            .on('finish', () =>
              resolve(
                `https://storage.cloud.google.com/${bucket}/${fname}/${EncodeUserFile}`,
              ),
            )
            .on('error', (error) => reject(error));
        });
      }),
    );
    console.log(result);
    return result;
  }

  async projectImage({ file }: IUpload) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);
    const files = await Promise.all(file);

    const result = await Promise.all(
      files.map((el) => {
        return new Promise((resolve, reject) => {
          const fname = `projectImage/${uuidv4()}`;
          const EncodeUserFile = encodeURIComponent(el.filename);
          el.createReadStream()
            .pipe(storage.file(`${fname}/${el.filename}`).createWriteStream())
            .on('finish', () =>
              resolve(
                `https://storage.cloud.google.com/${bucket}/${fname}/${EncodeUserFile}`,
              ),
            )
            .on('error', (error) => reject(error));
        });
      }),
    );

    return result;
  }

  async projectFile({ file }: IUpload) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);
    const files = await Promise.all(file);

    const result = await Promise.all(
      files.map((el) => {
        return new Promise((resolve, reject) => {
          const fname = `projectFile/${uuidv4()}`;
          const EncodeUserFile = encodeURIComponent(el.filename);
          el.createReadStream()
            .pipe(storage.file(`${fname}/${el.filename}`).createWriteStream())
            .on('finish', () =>
              resolve(
                `https://storage.cloud.google.com/${bucket}/${fname}/${EncodeUserFile}`,
              ),
            )
            .on('error', (error) => reject(error));
        });
      }),
    );
    return result;
  }

  async deleteFileWithGoogle({ URL }) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);

    const dir = URL.replace(`https://storage.cloud.google.com/${bucket}/`, '');
    const fname = dir.split('/');
    const decodeFileName = decodeURIComponent(fname[fname.length - 1]);
    fname.pop();
    fname.push(decodeFileName);
    const decodedfname = fname.join('/');

    const result = await storage
      .file(decodedfname)
      .delete()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
    return result;
  }
}
