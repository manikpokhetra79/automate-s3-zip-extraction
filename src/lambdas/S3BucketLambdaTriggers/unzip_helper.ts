import utils from "./utils";

const zipFileExtractionWithYauzl = async (
  Bucket: string,
  buffer: any,
  filePath: string
) => {
  const yauzl = require("yauzl");
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(buffer, { lazyEntries: true }, (error, zipfile) => {
      if (error) {
        reject(error);
      }
      zipfile.readEntry();
      zipfile.on("entry", (entry) => {
        console.log("fileName: ", entry.fileName);
        readFileStream(zipfile, entry, Bucket, reject, filePath);
      });
      zipfile.on("end", () => resolve("files extraction complete"));
    });
  });
};

const readFileStream = (
  zipfile: any,
  entry: any,
  Bucket: string,
  reject: any,
  filePath: string
) => {
  if (utils.skipFile(entry)) {
    zipfile.readEntry();
  } else {
    // file entry
    zipfile.openReadStream(entry, (err, readStream) => {
      if (err) {
        console.log("openReadStream error: ", err);
        reject(err);
      }
      const { writeStream, promise } = utils.uploadStream({
        Bucket,
        Key: entry.fileName,
        filePath,
      });
      readStream.pipe(writeStream);
      promise.then(() => {
        // resolve upload
        console.log(entry.fileName + " Uploaded successfully!");
        zipfile.readEntry();
      });
    });
  }
};
export default {
  zipFileExtractionWithYauzl,
};
