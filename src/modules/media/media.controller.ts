import { Request, Response } from "express";
import { CloudinaryService } from "./cloudinary.service";
import { catchAsync } from "../../utils/catch-async.util";
import { sendSuccess } from "../../utils/api-response.util";
import { AppError } from "../../utils/app-error.util";

export class MediaController {
  private service: CloudinaryService;

  constructor() {
    this.service = new CloudinaryService();
  }

  public upload = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }

    // When using multer-storage-cloudinary, the file is already uploaded
    // and its info is available on req.file
    const file = req.file;

    return sendSuccess(
      res,
      {
        url: file.path,
        link: file.path, // Direct link as requested
        public_id: file.filename,
        mimetype: file.mimetype,
        size: file.size,
      },
      "Media uploaded successfully",
    );
  });
}
