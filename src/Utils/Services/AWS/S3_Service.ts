import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({});

const getObject = async (
  params: GetObjectCommandInput
): Promise<GetObjectCommandOutput> => {
  const command = new GetObjectCommand(params);
  return s3Client.send(command);
};

const uploadToS3 = async (params: any) => {
  const uploadParams = {
    client: s3Client,
    params,
  };
  const uploader = new Upload(uploadParams);
  uploader.on("httpUploadProgress", (progress) => {
    console.log(progress);
  });
  return uploader.done();
};

export default {
  getObject,
  upload: uploadToS3,
};
