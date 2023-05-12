import { S3Event } from "aws-lambda";
import dropRight from "lodash/dropRight";
import s3Client from "../../Utils/Services/AWS/S3_Service";
const stream = require("stream");

const decodeUriKey = (event: S3Event): string => {
  return decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
};
const getFilePath = (fileKey: string): string => {
  const filePath = fileKey.split("/");
  return `${dropRight(filePath).toString()}/`;
};

const streamToBuffer = async (stream: any) => {
  const chunks: Array<Buffer> = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};
const skipFile = (entry: any): boolean => {
  const { fileName } = entry;
  if (/\/$/.test(fileName) || fileName.startsWith("__MACOSX/")) {
    console.log("skipFile: fileName:", fileName);
    return true;
  }
  return false;
};
const uploadStream = (params) => {
  const { Bucket, Key, filePath } = params;
  const pdfPath = "pdfs/";
  const fileKey = pdfPath.concat(Key);
  const uploadPath = filePath === "/" ? fileKey : filePath.concat(fileKey);
  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    promise: s3Client.upload({ Bucket, Key: uploadPath, Body: pass }),
  };
};
export default {
  decodeUriKey,
  getFilePath,
  streamToBuffer,
  skipFile,
  uploadStream,
};
