import mongoose, { Schema, Document } from "mongoose";
import { IChatMessageEntity, ChatRole } from "../chat.entity";

export interface IChatMessage
  extends Omit<IChatMessageEntity, "id">, Document {}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    chat_session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ChatRole),
      required: true,
    },
    content: {
      type: Schema.Types.Mixed, // Allows string or JSON
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const ChatMessage = mongoose.model<IChatMessage>(
  "ChatMessage",
  chatMessageSchema,
);

export default ChatMessage;
