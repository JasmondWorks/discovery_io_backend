import mongoose, { Schema, Document } from "mongoose";
import { IChatSessionEntity } from "../chat.entity";

export interface IChatSession
  extends Omit<IChatSessionEntity, "id">, Document {}

const chatSessionSchema = new Schema<IChatSession>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "New Chat",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const ChatSession = mongoose.model<IChatSession>(
  "ChatSession",
  chatSessionSchema,
);

export default ChatSession;
