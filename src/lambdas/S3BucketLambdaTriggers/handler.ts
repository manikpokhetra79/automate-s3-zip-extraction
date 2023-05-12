import { S3Event } from "aws-lambda";
import utils from "./utils";
import helper from "./unzip_helper";
import s3Client from "../../Utils/Services/AWS/S3_Service";

export const index = async (event: S3Event) => {
  console.log(JSON.stringify(event, null, 2));
  const Bucket = event.Records[0].s3.bucket.name;
  const Key = utils.decodeUriKey(event);
  try {
    const params = { Bucket, Key };
    const object = await s3Client.getObject(params);
    const imageBody = await utils.streamToBuffer(object.Body);
    const filePath = utils.getFilePath(Key);
    const result = await helper.zipFileExtractionWithYauzl(
      Bucket,
      imageBody,
      filePath
    );
    console.log("🚀index ~ result:", result);
    return {
      status: 200,
      response: "File content extracted successfully",
    };
  } catch (error) {
    console.log(error);
    throw new Error(
      JSON.stringify({
        status: 500,
        response: "Some error occured while extracting the files from zip",
      })
    );
  }
};
