import { Response } from "express";
import { ChatService } from "./chat.service";
import { catchAsync } from "../../utils/catch-async.util";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { ChatRole } from "./chat.entity";
import { NormalizationService } from "../normalization/normalization.service";
import Tool from "../tool/models/tool.model";

export class ChatController {
  private chatService: ChatService;
  private normalizationService: NormalizationService;

  constructor() {
    this.chatService = new ChatService();
    this.normalizationService = new NormalizationService();
  }

  private async generateAIResponse(
    content: string,
    sessionId: string,
    userId: string,
  ) {
    // 1. Extract Intent using NormalizationService
    const intent = await this.normalizationService.normalizeInput({
      input: content,
      schemaType: "chat_intent",
    });

    // 2. Fetch all verified tools from the database to restrict recommendations
    const availableTools = await Tool.find(
      {},
      "name description verified_use_cases platform",
    );

    // 3. Structure the prompt to force the AI to only select from DB tools
    const recommendationPrompt = `
      User Intent: ${JSON.stringify(intent)}
      Available Database Tools: ${JSON.stringify(availableTools)}
      
      Instructions: Return up to 3 tools from the "Available Database Tools" that best match the User Intent (user_persona, core_task, success_criteria). 
      If no tools fit the criteria decently well, return an empty array for recommended_tools and explain why gracefully in the message. 
      Only return tools strictly present in the provided list.
    `;

    // 4. Extract specific tooling recommendations dynamically
    const recommendation = await this.normalizationService.normalizeInput({
      input: recommendationPrompt,
      schemaType: "tool_recommendation",
    });

    // 5. Format response message for storage
    let aiResponseText = `${recommendation.message}\n\n`;
    if (
      recommendation.recommended_tools &&
      recommendation.recommended_tools.length > 0
    ) {
      recommendation.recommended_tools.forEach((t: any) => {
        aiResponseText += `- **${t.name}**: ${t.rationale}\n`;
      });
    }

    const aiMessage = await this.chatService.addMessage(
      sessionId,
      userId,
      ChatRole.ASSISTANT,
      aiResponseText,
    );

    return aiMessage;
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

        // Generate dynamic LLM response via AI and Normalization Services
        await this.generateAIResponse(
          prompt,
          (session as any)._id.toString(),
          userId,
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

      // 2. Generate actual LLM response restricted to the DB Catalog tools via Normalization service
      const aiMessage = await this.generateAIResponse(
        content,
        id as string,
        userId,
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
