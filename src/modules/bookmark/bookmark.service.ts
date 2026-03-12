import Bookmark from "./models/bookmark.model";
import Tool from "../tool/models/tool.model";
import { AppError } from "../../utils/app-error.util";
import { MongooseRepository } from "../../utils/crud.util";

export class BookmarkService {
  private bookmarkRepo: MongooseRepository<any>;

  constructor() {
    this.bookmarkRepo = new MongooseRepository(Bookmark);
  }

  async saveTool(userId: string, data: any) {
    try {
      let payload = {
        user_id: userId,
        tool_id: data.tool_id,
        tool_name: data.tool_name,
        tool_description: data.tool_description,
        tool_url: data.tool_url,
      };

      // If only tool_id is provided, fetch details from the catalog
      if (data.tool_id && !data.tool_name) {
        const tool = await Tool.findById(data.tool_id);
        if (!tool) {
          throw new AppError("Tool not found in catalog", 404);
        }
        payload.tool_name = tool.name;
        payload.tool_description = tool.description;
        payload.tool_url = tool.url;
      }

      if (!payload.tool_name || !payload.tool_url) {
        throw new AppError("Tool name and URL are required to bookmark.", 400);
      }

      const bookmark = await this.bookmarkRepo.create(payload);
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
