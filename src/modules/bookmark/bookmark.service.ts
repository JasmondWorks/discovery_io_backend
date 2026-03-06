import Bookmark from "./models/bookmark.model";
import { AppError } from "../../utils/app-error.util";
import { MongooseRepository } from "../../utils/crud.util";

export class BookmarkService {
  private bookmarkRepo: MongooseRepository<any>;

  constructor() {
    this.bookmarkRepo = new MongooseRepository(Bookmark);
  }

  async saveTool(userId: string, data: any) {
    try {
      const bookmark = await this.bookmarkRepo.create({
        user_id: userId,
        tool_name: data.tool_name,
        tool_description: data.tool_description,
        tool_url: data.tool_url,
        tool_id: data.tool_id, // If it comes from curated tools
      });
      return bookmark;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError("You have already bookmarked this tool.", 400);
      }
      throw error;
    }
  }

  async getUserBookmarks(userId: string, queryParams: any) {
    return await this.bookmarkRepo.findAll(
      queryParams,
      { user_id: userId },
      ["tool_name", "tool_description"], // Search fields
    );
  }

  async deleteBookmark(bookmarkId: string, userId: string) {
    const bookmark = await this.bookmarkRepo.findById(bookmarkId);
    if (!bookmark) {
      throw new AppError("Bookmark not found", 404);
    }

    if (bookmark.user_id.toString() !== userId) {
      throw new AppError("Unauthorized to remove this bookmark", 403);
    }

    await this.bookmarkRepo.delete(bookmarkId);
  }
}
