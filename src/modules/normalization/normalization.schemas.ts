export const NormalizationSchemas: Record<string, any> = {
  product: {
    name: "string",
    brand: "string",
    category: "string",
    price: "number",
    specifications: "object",
  },
  event: {
    title: "string",
    date: "string",
    location: "string",
    attendees_count: "number",
    description: "string",
  },
  contact: {
    first_name: "string",
    last_name: "string",
    email: "string",
    phone: "string",
    organization: "string",
  },
  professional_profile: {
    industry: "string",
    core_role: "string",
    experience_level: "string",
    key_skills: "array of strings",
    primary_tools: "array of strings",
    daily_responsibilities: "array of strings",
    current_objectives: "array of strings",
    main_pain_points: "array of strings",
    detailed_context: "string summary of their work environment and goals",
  },
  chat_intent: {
    user_persona: "string (e.g., Senior Backend Dev)",
    core_task: "string (e.g., Schema Migration)",
    success_criteria: "string (e.g., Must support SQL export)",
    is_clarification_needed: "boolean",
  },
  expert_advice: {
    message:
      "string (graceful, empathetic introduction that acknowledges the user's problem)",
    recommended_tools:
      "array of objects — return a MINIMUM of 5 tools, ranked by relevance. " +
      "Each object: { " +
      "name: 'string', " +
      "url: 'string (include the official website link provided in the context, if available)', " +
      "rationale: 'string explaining why this tool fits the user intent. DO NOT include the limitation or scores here.', " +
      "usefulness_score: 'number (0-100)', " +
      "relevance_score: 'number (0-100)', " +
      "reliability_score: 'number (0-100)', " +
      "comparison_vs_alternatives: 'string comparing this tool to the others in the list for this specific persona', " +
      "limitation: 'string — REQUIRED for the #1 ranked tool: one honest trade-off or limitation (e.g. steep learning curve, no offline mode). DO NOT repeat this in the rationale.' " +
      "}",
    recommended_workflows:
      "array of objects — up to 2. Each object: { title: 'string', steps: 'array of strings (DO NOT include numbers like 1., 2. etc, just the text)', advantages_of_this_workflow: 'string explaining specific efficiency gains over manual or standard methods' }",
    recommended_solutions:
      "array of objects — up to 2. Each object: { issue_title: 'string', cause_explanation: 'string', resolution_steps: 'array of strings (DO NOT include numbers like 1., 2. etc, just the text)', why_this_fix_is_optimal: 'string comparing this solution against temporary patches or other common fixes' }",
    tradeoff_analysis:
      "string (comprehensive deep-dive summary comparing all recommendations, covering speed vs. cost, security vs. convenience, and scalability tradeoffs to empower the user's final decision)",
  },
};

export type SchemaType = keyof typeof NormalizationSchemas;
