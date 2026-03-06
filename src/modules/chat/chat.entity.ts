import { Types } from "mongoose";

export enum ChatRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export interface IChatSessionEntity {
  id: string;
  user_id: string | Types.ObjectId;
  title: string;
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
