import { Types } from "mongoose";

export enum ChatRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

/**
 * Tracks where a chat session is in the PRD-defined 2-step flow:
 * - CLARIFYING: System has restated the user's intent and is awaiting confirmation/correction.
 * - ACTIVE: User confirmed the intent; recommendations have been delivered. Subsequent
 *   messages are treated as follow-up queries.
 */
export enum ChatSessionStatus {
  CLARIFYING = "clarifying",
  ACTIVE = "active",
}

export interface IExtractedIntent {
  user_persona: string;
  core_task: string;
  success_criteria: string;
  original_query: string;
}

export interface IChatSessionEntity {
  id: string;
  user_id: string | Types.ObjectId;
  title: string;
  /** Tracks the PRD clarification flow stage */
  status: ChatSessionStatus;
  /** Stored after the first clarification so recommendations can use it later */
  extracted_intent?: IExtractedIntent;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessageEntity {
  id: string;
  chat_session_id: string | Types.ObjectId;
  role: ChatRole;
  content: any; // Can be string or JSON
  createdAt: Date;
  updatedAt: Date;
}
