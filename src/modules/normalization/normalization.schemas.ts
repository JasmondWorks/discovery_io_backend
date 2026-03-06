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
  tool_recommendation: {
    recommended_tools:
      "array of objects { name: 'string', rationale: 'string explaining why this tool fits the user persona and task' }",
    message: "string (graceful explanation or introduction)",
  },
};

export type SchemaType = keyof typeof NormalizationSchemas;
