export function getEnv() {
  return {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET: process.env.UPLOAD_PRESET,
  };
}
