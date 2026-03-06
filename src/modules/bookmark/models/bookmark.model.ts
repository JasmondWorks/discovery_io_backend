import mongoose, { Schema, Document } from "mongoose";
import { IBookmarkEntity } from "../bookmark.entity";

export interface IBookmark extends Omit<IBookmarkEntity, "id">, Document {}

const bookmarkSchema = new Schema<IBookmark>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Allows referencing a strict catalog database if wanted soon
    tool_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tool",
      required: false,
    },
    tool_name: {
      type: String,
      required: true,
    },
    tool_description: {
      type: String,
      required: true,
    },
    tool_url: {
      type: String,
      required: true,
    },
    saved_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Prevent users from bookmarking exactly the same tool duplication repeatedly
bookmarkSchema.index({ user_id: 1, tool_name: 1 }, { unique: true });

const Bookmark = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);

export default Bookmark;
