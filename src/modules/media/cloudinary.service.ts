import { v2 as cloudinary } from "cloudinary";
import appConfig from "../../config/app.config";
import { AppError } from "../../utils/app-error.util";

export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: appConfig.cloudinary.cloudName,
      api_key: appConfig.cloudinary.apiKey,
      api_secret: appConfig.cloudinary.apiSecret,
    });
  }

  /**
   * Upload a file to Cloudinary
   * @param filePath Path to the temporary file
   * @param folder Target folder in Cloudinary
   */
  async uploadMedia(
    filePath: string,
    folder: string = "discover_io",
  ): Promise<any> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: "auto",
      });
      return result;
    } catch (error: any) {
      throw new AppError(`Cloudinary Upload Error: ${error.message}`, 500);
    }
  }

  /**
   * Delete a file from Cloudinary
   * @param publicId The public ID of the resource
   */
  async deleteMedia(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error: any) {
      throw new AppError(`Cloudinary Delete Error: ${error.message}`, 500);
    }
  }
}
