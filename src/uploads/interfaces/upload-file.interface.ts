import { fileTypes } from "../enum/file-type.enum";

export interface UploadFileInterface {
  name: string;
  path: string;
  type: fileTypes;
  mime: string;
  size: number;
}