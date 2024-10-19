import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function uploadImage(data: AsyncIterable<Uint8Array>) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "fragrances" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Pass the stream data only once
    writeAsyncIterableToWritable(data, uploadStream).catch(reject);
  });
}

// This function will pipe the async iterable (stream) to the writable stream (uploadStream)
async function writeAsyncIterableToWritable(
  source: AsyncIterable<Uint8Array>,
  writable: any
) {
  for await (const chunk of source) {
    if (!writable.write(chunk)) {
      await new Promise((resolve) => writable.once("drain", resolve));
    }
  }
  writable.end();
}
export { uploadImage };
