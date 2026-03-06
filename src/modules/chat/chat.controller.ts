import { Response } from "express";
import { ChatService } from "./chat.service";
import { catchAsync } from "../../utils/catch-async.util";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { ChatRole } from "./chat.entity";

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  public createChatSession = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { prompt } = req.body;
      const userId = (req.user as any).id;

      let titleSource = prompt || "New Conversation";
      const session = await this.chatService.createSession(userId, titleSource);

      if (prompt) {
        // Save user initial prompt
        await this.chatService.addMessage(
          (session as any)._id.toString(),
          userId,
          ChatRole.USER,
          prompt,
        );

        // Optionally, generate LLM response here or mock it for now
        const mockLLMResponse = `Here's an AI recommendation based on your prompt: "${prompt}". Check out these tools!`;

        await this.chatService.addMessage(
          (session as any)._id.toString(),
          userId,
          ChatRole.ASSISTANT,
          mockLLMResponse,
        );
      }

      return sendSuccess(
        res,
        session,
        "Chat session created successfully",
        201,
      );
    },
  );

  public getChatSessions = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = (req.user as any).id;
      const result = await this.chatService.getSessionsByUser(
        userId,
        req.query,
      );
      return sendSuccess(res, result, "Chat sessions retrieved successfully");
    },
  );

  public getSessionMessages = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const userId = (req.user as any).id;

      const messages = await this.chatService.getMessagesBySession(
        id as string,
        userId,
      );
      return sendSuccess(res, messages, "Messages retrieved successfully");
    },
  );

  public addMessageToSession = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const { content } = req.body;
      const userId = (req.user as any).id;

      // 1. Save user's message
      const userMessage = await this.chatService.addMessage(
        id as string,
        userId,
        ChatRole.USER,
        content,
      );

      // 2. Here is where the actual LLM call would happen.
      // For now, we simulate an AI response.
      const aiResponseContent = {
        text: `I understood: ${content}`,
        suggestedTools: [
          {
            name: "Mock AI Tool",
            description: "A tool that helps with your prompt.",
          },
        ],
      };

      const aiMessage = await this.chatService.addMessage(
        id as string,
        userId,
        ChatRole.ASSISTANT,
        aiResponseContent,
      );

      return sendSuccess(
        res,
        { userMessage, aiMessage },
        "Message added and AI responded successfully",
        201,
      );
    },
  );
}
