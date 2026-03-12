import { Response } from "express";
import { ChatService } from "./chat.service";
import { catchAsync } from "../../utils/catch-async.util";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { ChatRole, ChatSessionStatus, IExtractedIntent } from "./chat.entity";
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

  /**
   * PRD Feature 5 — Step 1 (Clarification / "Diagnosis"):
   * Extracts three structured attributes from the user's raw query and returns a
   * human-readable clarification message that the user can confirm or correct.
   *
   * @returns { clarificationText, intent }
   */
  private async generateClarification(
    userQuery: string,
  ): Promise<{ clarificationText: string; intent: IExtractedIntent }> {
    let raw: any = {};
    try {
      raw = await this.normalizationService.normalizeInput({
        input: userQuery,
        schemaType: "chat_intent",
      });
    } catch (error) {
      console.error("AI intent extraction failed, using fallback:", error);
    }

    raw = raw || {};

    const intent: IExtractedIntent = {
      user_persona: raw.user_persona || "a professional",
      core_task: raw.core_task || "the described task",
      success_criteria:
        raw.success_criteria || "a solution that meets your needs",
      original_query: userQuery,
    };

    const clarificationText =
      `I want to make sure I understand your need before searching. Here is what I understood:\n\n` +
      `- **You are:** ${intent.user_persona}\n` +
      `- **Your task:** ${intent.core_task}\n` +
      `- **Your goal / success criteria:** ${intent.success_criteria}\n\n` +
      `Is this correct? Reply **"Yes"** (or anything confirming) to get your recommendations, ` +
      `or tell me what I got wrong and I'll adjust before searching.`;

    return { clarificationText, intent };
  }

  /**
   * PRD Feature 6 — Step 2 (Recommendations):
   * Fetches all verified DB assets and generates a comparative expert-advice response
   * restricted to those assets. Uses the stored extracted intent for precision.
   *
   * If the user's confirmation message contains a correction, that correction is
   * incorporated so the recommendations reflect the user's actual intent.
   */
  private async generateRecommendations(
    sessionId: string,
    userId: string,
    storedIntent: IExtractedIntent,
    userConfirmationOrCorrection: string,
  ): Promise<any> {
    // Combine stored intent with the user's latest message to allow inline corrections
    const combinedContext =
      `Original user query: "${storedIntent.original_query}"\n` +
      `Previously extracted understanding:\n` +
      `  - User Persona: ${storedIntent.user_persona}\n` +
      `  - Core Task: ${storedIntent.core_task}\n` +
      `  - Success Criteria: ${storedIntent.success_criteria}\n` +
      `User's confirmation / correction: "${userConfirmationOrCorrection}"`;

    // Build search keywords from intent
    const keywords = [
      storedIntent.user_persona,
      storedIntent.core_task,
      ...storedIntent.original_query.split(" ").filter((w) => w.length > 3),
    ].join(" ");

    console.log(
      `Expert Advisor: Searching for relevant assets with keywords: "${keywords}"`,
    );

    // Fetch relevant assets instead of the whole database to prevent context overflow
    // and improve AI selection accuracy
    const [availableTools, availableWorkflows, availableSolutions] =
      await Promise.all([
        Tool.find(
          {
            $or: [
              {
                tags: {
                  $in: [
                    storedIntent.user_persona.toLowerCase().replace(" ", "_"),
                  ],
                },
              },
              { $text: { $search: keywords } },
            ],
          },
          "name description url verified_use_cases platform pricing",
        ).limit(30),

        Workflow.find(
          {
            $or: [
              {
                use_cases: {
                  $in: storedIntent.core_task.toLowerCase().split(" "),
                },
              },
              { $text: { $search: keywords } },
            ],
          },
          "title description steps use_cases",
        ).limit(10),

        Solution.find(
          {
            $or: [
              {
                tags: {
                  $in: [
                    storedIntent.user_persona.toLowerCase().replace(" ", "_"),
                  ],
                },
              },
              { $text: { $search: keywords } },
            ],
          },
          "issue_title description resolution_steps tags tradeoffs cause_explanation",
        ).limit(10),
      ]);

    console.log(
      `Expert Advisor: Found ${availableTools.length} tools, ${availableWorkflows.length} workflows, ${availableSolutions.length} solutions`,
    );

    const expertPrompt =
      `${combinedContext}\n\n` +
      `CONTEXT FROM DATABASE:\n` +
      `- Available Tools: ${JSON.stringify(availableTools)}\n` +
      `- Available Workflows: ${JSON.stringify(availableWorkflows)}\n` +
      `- Available Solutions: ${JSON.stringify(availableSolutions)}\n\n` +
      `Instructions:\n` +
      `1. Provide a comprehensive response using ONLY the data provided above.\n` +
      `2. Recommended Tools: Return up to 5, ranked by relevance. For each tool MUST include:\n` +
      `   - A specific comparison against other tools.\n` +
      `   - Scores (0-100) for Usefulness, Relevance, and Reliability based on the user's intent.\n` +
      `   - At least one Limitation or Trade-off for the top-ranked tool.\n` +
      `3. Recommended Workflows: Up to 2. Explain efficiency/speed advantages.\n` +
      `4. Recommended Solutions: Up to 2. Explain why this fix is optimal.\n` +
      `5. Tradeoff Analysis: A final deep-dive summary comparing all recommendations.\n\n` +
      `If nothing in the database matches the user's need, explain gracefully and suggest refining the query.`;

    let advice: any = {};
    try {
      advice = await this.normalizationService.normalizeInput({
        input: expertPrompt,
        schemaType: "expert_advice",
      });
    } catch (error) {
      console.error("AI normalization failed for recommendations:", error);
    }

    advice = advice || {};

    const hasTools =
      Array.isArray(advice.recommended_tools) &&
      advice.recommended_tools.length > 0;
    const hasWorkflows =
      Array.isArray(advice.recommended_workflows) &&
      advice.recommended_workflows.length > 0;
    const hasSolutions =
      Array.isArray(advice.recommended_solutions) &&
      advice.recommended_solutions.length > 0;

    // Build rich formatted response text
    let aiResponseText = `${advice.message || "Here are my recommendations based on your request:"}\n\n`;

    if (!hasTools && !hasWorkflows && !hasSolutions) {
      aiResponseText += `Unfortunately, I couldn't find any matching tools, workflows, or solutions in our verified database that exactly fit your needs right now.\n\nPlease try adjusting your search terms or specifying a broader use case!`;
    }

    // Helper to clean up manual numbering strings from AI (e.g. "1. Step" -> "Step")
    const cleanStep = (text: string) =>
      text.replace(/^\d+[\.\)\s]+/, "").trim();

    // Tools Section — PRD requires ranking criteria to be explicit
    if (hasTools) {
      aiResponseText += `### Recommended Tools\n`;
      aiResponseText += `*Ranked by: Usefulness · Relevance · Reliability to your specific task*\n\n`;
      advice.recommended_tools.forEach((t: any, idx: number) => {
        const rankLabel = idx === 0 ? ` (Top Pick)` : "";
        const toolName = t.name || t.tool_name || "Tool";
        const toolUrl = t.url ? ` - [Visit Website](${t.url})` : "";
        const rationale =
          t.rationale ||
          t.description ||
          "Recommended tool based on your context.";

        aiResponseText += `**#${idx + 1} ${toolName}**${rankLabel}${toolUrl}\n\n`;
        aiResponseText += `${rationale}\n\n`;
        aiResponseText += `**Scores:** Usefulness: ${t.usefulness_score || 85}% | Relevance: ${t.relevance_score || 85}% | Reliability: ${t.reliability_score || 85}%\n\n`;

        if (t.comparison_vs_alternatives) {
          aiResponseText += `**Comparison:** ${t.comparison_vs_alternatives}\n\n`;
        }

        // PRD requires at least a limitation on the top-ranked tool
        if (idx === 0 && t.limitation) {
          aiResponseText += `> **Note (Limitation):** ${t.limitation}\n\n`;
        }
      });
    }

    // Workflows Section
    if (hasWorkflows) {
      aiResponseText += `### Recommended Workflows\n\n`;
      advice.recommended_workflows.forEach((w: any) => {
        const workflowTitle = w.title || "Workflow";
        aiResponseText += `#### ${workflowTitle}\n\n`;
        if (w.advantages_of_this_workflow) {
          aiResponseText += `*Efficiency Gain:* ${w.advantages_of_this_workflow}\n\n`;
        }
        if (Array.isArray(w.steps)) {
          w.steps.forEach((step: string, idx: number) => {
            aiResponseText += `${idx + 1}. ${cleanStep(step)}\n`;
          });
        }
        aiResponseText += `\n`;
      });
    }

    // Solutions Section
    if (hasSolutions) {
      aiResponseText += `### Solutions to Common Issues\n\n`;
      advice.recommended_solutions.forEach((s: any) => {
        const solutionTitle = s.issue_title || "Solution";
        aiResponseText += `#### ${solutionTitle}\n\n`;
        aiResponseText += `**Cause:** ${s.cause_explanation || "Not specified."}\n\n`;
        if (s.why_this_fix_is_optimal) {
          aiResponseText += `**Expert Choice:** ${s.why_this_fix_is_optimal}\n\n`;
        }

        aiResponseText += `**Resolution Steps:**\n`;
        if (Array.isArray(s.resolution_steps)) {
          s.resolution_steps.forEach((step: string, idx: number) => {
            aiResponseText += `${idx + 1}. ${cleanStep(step)}\n`;
          });
        }
        aiResponseText += `\n`;
      });
    }

    // Tradeoff Analysis — PRD requires this for balanced advice
    if (advice.tradeoff_analysis) {
      aiResponseText += `### Tradeoff Analysis & Expert Insights\n\n`;
      aiResponseText += `${advice.tradeoff_analysis}\n`;
    }

    return await this.chatService.addMessage(
      sessionId,
      userId,
      ChatRole.ASSISTANT,
      aiResponseText,
    );
  }

  /**
   * POST /chats
   *
   * PRD Flow — Step 1:
   * Creates a chat session. If a prompt is provided the system immediately extracts
   * the user's intent and responds with a structured clarification (User Persona,
   * Core Task, Success Criteria) for the user to confirm before recommendations
   * are generated. Session status is set to CLARIFYING.
   */
  public createChatSession = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { prompt } = req.body;
      const userId = (req.user as any).id;

      const titleSource = prompt || "New Conversation";
      const session = await this.chatService.createSession(userId, titleSource);
      const sessionId = (session as any)._id.toString();

      if (prompt) {
        // Save user's initial message
        await this.chatService.addMessage(
          sessionId,
          userId,
          ChatRole.USER,
          prompt,
        );

        // PRD Feature 5 — Step 1: Clarify before searching
        const { clarificationText, intent } =
          await this.generateClarification(prompt);

        // Persist clarification as the assistant's first message
        // We send a structured object so the frontend can render the confirmation card
        await this.chatService.addMessage(
          sessionId,
          userId,
          ChatRole.ASSISTANT,
          {
            text: clarificationText,
            intent: intent,
          },
        );

        // Store extracted intent in the session so Step 2 can use it
        const updatedSession = await this.chatService.updateSession(sessionId, {
          status: ChatSessionStatus.CLARIFYING,
          extracted_intent: intent,
        });

        // Return the updated session to the frontend
        return sendSuccess(
          res,
          updatedSession,
          "Chat session created. Please confirm or correct the system's understanding.",
          201,
        );
      }

      return sendSuccess(
        res,
        session,
        "Chat session created. Please confirm or correct the system's understanding.",
        201,
      );
    },
  );

  /**
   * GET /chats
   * Returns the authenticated user's chat session history.
   */
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

  /**
   * GET /chats/:id/messages
   * Returns all messages in a specific session, chronologically sorted.
   */
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

  /**
   * POST /chats/:id/messages
   *
   * Handles two distinct states defined by the PRD:
   *
   * 1. CLARIFYING  — The user's message is a confirmation or correction of the
   *    system's understanding. The system generates full recommendations using
   *    the stored intent + the user's correction, then advances to ACTIVE.
   *
   * 2. ACTIVE — Normal follow-up query. The system runs the same expert-advice
   *    pipeline directly (clarification already happened in this session).
   */
  public addMessageToSession = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const { content } = req.body;
      const userId = (req.user as any).id;

      // Verify session ownership and retrieve current state
      const session = await this.chatService.getSessionById(
        id as string,
        userId,
      );

      // Save user's message
      const userMessage = await this.chatService.addMessage(
        id as string,
        userId,
        ChatRole.USER,
        content,
      );

      let aiMessage: any;

      if ((session as any).status === ChatSessionStatus.CLARIFYING) {
        // PRD Feature 5 — Step 2: User confirmed/corrected → generate recommendations
        const storedIntent: IExtractedIntent = (session as any)
          .extracted_intent;

        aiMessage = await this.generateRecommendations(
          id as string,
          userId,
          storedIntent,
          content,
        );

        // Advance session to ACTIVE so subsequent messages are treated as follow-ups
        await this.chatService.updateSession(id as string, {
          status: ChatSessionStatus.ACTIVE,
        });
      } else {
        // Session is ACTIVE — treat as a follow-up query
        // Re-use the session's stored intent as baseline context if available
        const storedIntent: IExtractedIntent | undefined = (session as any)
          .extracted_intent;

        if (storedIntent) {
          // Generate recommendations directly with the new query
          aiMessage = await this.generateRecommendations(
            id as string,
            userId,
            { ...storedIntent, original_query: content },
            content,
          );
        } else {
          // Session was created without an initial prompt — run full clarification first
          const { clarificationText, intent } =
            await this.generateClarification(content);

          aiMessage = await this.chatService.addMessage(
            id as string,
            userId,
            ChatRole.ASSISTANT,
            {
              text: clarificationText,
              intent: intent,
            },
          );

          await this.chatService.updateSession(id as string, {
            status: ChatSessionStatus.CLARIFYING,
            extracted_intent: intent,
          });
        }
      }

      return sendSuccess(
        res,
        { userMessage, aiMessage },
        "Message added and AI responded successfully",
        201,
      );
    },
  );
}
