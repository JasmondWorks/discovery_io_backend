import { Types } from "mongoose";

export interface IBookmarkEntity {
  id: string;
  user_id: string | Types.ObjectId;
  tool_id?: string | Types.ObjectId; // Optional relationship if querying catalog
  tool_name: string;
  tool_description: string;
  tool_url: string;
  saved_at: Date;
  updatedAt: Date;
}
