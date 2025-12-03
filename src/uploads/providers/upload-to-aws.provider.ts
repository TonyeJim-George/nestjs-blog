import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuid4} from 'uuid';

@Injectable()
export class UploadToAwsProvider {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  public async fileUpload(file: Express.Multer.File){
      console.log("=== FILE RECEIVED IN PROVIDER ===");
      console.log("file.originalname:", file?.originalname);
      console.log("file.buffer length:", file?.buffer?.length);

      console.log("=== AWS CREDENTIALS ===");
      console.log("AWS_ACCESS_KEY_ID:", this.configService.get('AWS_ACCESS_KEY_ID'));
      console.log("AWS_SECRET_ACCESS_KEY:", !!this.configService.get('AWS_SECRET_ACCESS_KEY'));
      console.log("AWS_REGION:", this.configService.get('AWS_REGION'));
      console.log("Bucket:", this.configService.get('appConfig.awsBucketName'));
      
    try{
      const s3 = new S3({
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
        region: this.configService.get<string>('AWS_REGION'),
      });

    const uploadResult = await s3.upload({
      Bucket: this.configService.get<string>('appConfig.awsBucketName'),
      Body: file.buffer,
      Key: this.generateFileName(file),
      ContentType: file.mimetype,
    }).promise()

    return uploadResult.Key;

    }catch(error){
      throw new RequestTimeoutException(error)
    }
    
  }

  generateFileName(file: Express.Multer.File){
    //Extract file name
    let name = file.originalname.split('.')[0];
    //Remove whitespaces
    name = name.replace(/\s/g, '').trim();
    //extract file extension
    let extension = path.extname(file.originalname);
    //Generate timestamp
    let timestamp = new Date().getTime().toString().trim();
    //Return file uuid
    return `${name}-${timestamp}-${uuid4()}${extension}`;
  }
}
