import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadFileToCloudinary(
  fileBuffer: Buffer
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "raw", folder: "askify" },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result as UploadResult);
        }
      )
      .end(fileBuffer);
  });
}
