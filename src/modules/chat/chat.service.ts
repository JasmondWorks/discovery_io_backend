import ChatSession from "./models/chat-session.model";
import ChatMessage from "./models/chat-message.model";
import { ChatRole } from "./chat.entity";
import { AppError } from "../../utils/app-error.util";
import { MongooseRepository } from "../../utils/crud.util";

export class ChatService {
  private sessionRepo: MongooseRepository<any>;
  private messageRepo: MongooseRepository<any>;

  constructor() {
    this.sessionRepo = new MongooseRepository(ChatSession);
    this.messageRepo = new MongooseRepository(ChatMessage);
  }

  async createSession(userId: string, initialMessageContent: string) {
    // Generate a title from the first message
    const title =
      initialMessageContent.length > 50
        ? `${initialMessageContent.substring(0, 50)}...`
        : initialMessageContent;

    const session = await this.sessionRepo.create({
      user_id: userId,
      title: title || "New Chat",
    });

    return session;
  }

  async getSessionsByUser(userId: string, queryParams: any) {
    return await this.sessionRepo.findAll(
      queryParams,
      { user_id: userId },
      ["title"], // Search fields
    );
  }

  async getSessionById(sessionId: string, userId: string) {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) {
      throw new AppError("Chat session not found", 404);
    }
    if (session.user_id.toString() !== userId) {
      throw new AppError("Unauthorized access to chat session", 403);
    }
    return session;
  }

  async getMessagesBySession(sessionId: string, userId: string) {
    // Ensure the session belongs to the user
    await this.getSessionById(sessionId, userId);

    const messages = await ChatMessage.find({
      chat_session_id: sessionId,
    }).sort({ createdAt: 1 });

    return messages;
  }

  async addMessage(
    sessionId: string,
    userId: string,
    role: ChatRole,
    content: any,
  ) {
    // Ensure the session belongs to the user
    await this.getSessionById(sessionId, userId);

    const message = await this.messageRepo.create({
      chat_session_id: sessionId,
      role,
      content,
    });

    return message;
  }
}
