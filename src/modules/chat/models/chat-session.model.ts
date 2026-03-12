import mongoose, { Schema, Document } from "mongoose";
import { IChatSessionEntity, ChatSessionStatus } from "../chat.entity";

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
    /**
     * Tracks the PRD clarification-flow stage.
     * Defaults to CLARIFYING so every new session starts with a clarification step.
     */
    status: {
      type: String,
      enum: Object.values(ChatSessionStatus),
      default: ChatSessionStatus.CLARIFYING,
    },
    /**
     * Stored after the AI extracts the user's intent during the clarification step.
     * Used to generate accurate recommendations when the user confirms/corrects.
     */
    extracted_intent: {
      user_persona: { type: String },
      core_task: { type: String },
      success_criteria: { type: String },
      original_query: { type: String },
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
