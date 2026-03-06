import { Response } from "express";
import { ChatService } from "./chat.service";
import { catchAsync } from "../../utils/catch-async.util";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { ChatRole } from "./chat.entity";
import { NormalizationService } from "../normalization/normalization.service";
import Tool from "../tool/models/tool.model";
import Workflow from "../workflow/models/workflow.model";
import Solution from "../solution/models/solution.model";

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

    // 2. Fetch all verified assets from the database to restrict recommendations
    const [availableTools, availableWorkflows, availableSolutions] =
      await Promise.all([
        Tool.find({}, "name description verified_use_cases platform"),
        Workflow.find({}, "title description steps use_cases"),
        Solution.find(
          {},
          "issue_title description resolution_steps tags tradeoffs cause_explanation",
        ),
      ]);

    // 3. Structure the prompt to force the AI to select from DB assets
    const expertPrompt = `
      User Intent: ${JSON.stringify(intent)}
      
      CONTEXT FROM DATABASE:
      - Available Tools: ${JSON.stringify(availableTools)}
      - Available Workflows: ${JSON.stringify(availableWorkflows)}
      - Available Solutions: ${JSON.stringify(availableSolutions)}
      
      Instructions: 
      1. Provide a comprehensive response using ONLY the data provided above.
      2. Recommended Tools: Up to 3. For each, MUST include:
         - A specific comparison against other tools.
         - Scores (0-100) for Usefulness, Relevance, and Reliability based on the user's intent.
      3. Recommended Workflows: Up to 2. Explain efficiency/speed advantages.
      4. Recommended Solutions: Up to 2. Explain why this fix is optimal.
      5. Tradeoff Analysis: A final deep-dive summary.
      
      If nothing in the database matches the user's need, explain gracefully.
    `;

    // 4. Extract structured expert advice
    const advice = await this.normalizationService.normalizeInput({
      input: expertPrompt,
      schemaType: "expert_advice",
    });

    // 5. Format comprehensive response message
    let aiResponseText = `${advice.message}\n\n`;

    // Tools Section
    if (advice.recommended_tools?.length > 0) {
      aiResponseText += `### 🛠️ Recommended Tools\n`;
      advice.recommended_tools.forEach((t: any) => {
        aiResponseText += `- **${t.name}**: ${t.rationale}\n`;
        aiResponseText += `  *Scores:* ⭐ Usefulness: **${t.usefulness_score}%** | 🎯 Relevance: **${t.relevance_score}%** | 🛡️ Reliability: **${t.reliability_score}%**\n`;
        if (t.comparison_vs_alternatives) {
          aiResponseText += `  *Comparison:* ${t.comparison_vs_alternatives}\n`;
        }
      });
      aiResponseText += `\n`;
    }

    // Workflows Section
    if (advice.recommended_workflows?.length > 0) {
      aiResponseText += `### 🔄 Recommended Workflows\n`;
      advice.recommended_workflows.forEach((w: any) => {
        aiResponseText += `#### ${w.title}\n`;
        if (w.advantages_of_this_workflow) {
          aiResponseText += `*Efficiency Gain:* ${w.advantages_of_this_workflow}\n\n`;
        }
        w.steps.forEach((step: string, idx: number) => {
          aiResponseText += `${idx + 1}. ${step}\n`;
        });
        aiResponseText += `\n`;
      });
    }

    // Solutions Section
    if (advice.recommended_solutions?.length > 0) {
      aiResponseText += `### 💡 Solutions to Common Issues\n`;
      advice.recommended_solutions.forEach((s: any) => {
        aiResponseText += `#### ${s.issue_title}\n`;
        aiResponseText += `*Cause:* ${s.cause_explanation}\n`;
        if (s.why_this_fix_is_optimal) {
          aiResponseText += `*Expert Choice:* ${s.why_this_fix_is_optimal}\n`;
        }
        aiResponseText += `\n*Resolution Steps:*\n`;
        s.resolution_steps.forEach((step: string, idx: number) => {
          aiResponseText += `${idx + 1}. ${step}\n`;
        });
        aiResponseText += `\n`;
      });
    }

    // Tradeoffs Section
    if (advice.tradeoff_analysis) {
      aiResponseText += `### ⚖️ Tradeoff Analysis & Expert Insights\n`;
      aiResponseText += `${advice.tradeoff_analysis}\n`;
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
