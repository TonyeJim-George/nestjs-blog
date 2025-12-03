import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { Upload } from '../upload.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UploadFileInterface } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enum/file-type.enum';

@Injectable()
export class UploadsService {

  constructor(

    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,

    private readonly uploadToAwsProvider: UploadToAwsProvider,

    private readonly configService: ConfigService,
  ) {}

    public async uploadFile(file: Express.Multer.File){
      console.log("=== FILE RECEIVED IN SERVICE ===");
      console.log("file:", file);
      console.log("file.buffer length:", file?.buffer?.length);
      console.log("file.originalname:", file?.originalname);
      console.log("file.mimetype:", file?.mimetype);
      console.log("file.size:", file?.size);
 
    if (!file) {
        throw new BadRequestException('No file was provided in the request.');
    }
    //Throw an error for unsupported MIME types
    if(
      !['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(file.mimetype))
      {
      throw new BadRequestException('Unsupported file type');
      }
    
    try{
      //Upload the file to AWS S3
      const name = await this.uploadToAwsProvider.fileUpload(file);
      //Generate a new entry to the database
      const uploadFile: UploadFileInterface = {
        name: name,
        path: `https://${this.configService.get<string>('appConfig.awsCloudfrontUrl')}/${name}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };
      const upload = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(upload);
    } catch(error){
      throw new ConflictException(error);
    }
    
  }
}
