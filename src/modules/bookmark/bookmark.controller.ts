import { Response } from "express";
import { BookmarkService } from "./bookmark.service";
import { catchAsync } from "../../utils/catch-async.util";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export class BookmarkController {
  private bookmarkService: BookmarkService;

  constructor() {
    this.bookmarkService = new BookmarkService();
  }

  public saveBookmark = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = (req.user as any).id;
      const bookmark = await this.bookmarkService.saveTool(userId, req.body);
      return sendSuccess(res, bookmark, "Tool bookmarked successfully", 201);
    },
  );

  public getBookmarks = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = (req.user as any).id;
      const result = await this.bookmarkService.getUserBookmarks(
        userId,
        req.query,
      );
      return sendSuccess(res, result, "Saved tools retrieved successfully");
    },
  );

  public deleteBookmark = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const userId = (req.user as any).id;

      await this.bookmarkService.deleteBookmark(id as string, userId);

      // 204 typically has no body, but we follow standard output format here based on previous setup
      res.status(204).send();
    },
  );
}
