import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 } from 'uuid';

const s3 = new AWS.S3();

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async fileUploadS3(file: string): Promise<AWS.S3.ManagedUpload.SendData> {
    try {
      const fileName = `file-${v4()}.pdf`;

      const rawFile = file.replace(/^data:([A-Za-z-+\/]+);base64,(.+)$/, '');

      const fileBuffer = Buffer.from(rawFile, 'base64');

      const params: AWS.S3.PutObjectRequest = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: fileBuffer,
        ACL: 'public-read',
      };

      return new Promise((resolve, reject) => {
        s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
          if (err) {
            reject(err.message);
            throw new Error(`Error: ${err.message}`);
          }

          delete data.Bucket;
          //delete data.ETag;
          delete data.Key;
          delete data.Location;

          const dataS3 = {
            ...data,
            filename: fileName,
          };

          resolve(dataS3);
        });
      });
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
}
