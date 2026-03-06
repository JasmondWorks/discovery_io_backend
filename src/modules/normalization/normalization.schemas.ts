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
      "string (graceful explanation, empathetic introduction to the user's problem)",
    recommended_tools:
      "array of objects { name: 'string', rationale: 'string explaining why this tool fits', comparison_vs_alternatives: 'string explaining why this is better than other database tools for this specific persona' }",
    recommended_workflows:
      "array of objects { title: 'string', steps: 'array of strings', advantages_of_this_workflow: 'string explaining specific efficiency gains over manual or standard methods' }",
    recommended_solutions:
      "array of objects { issue_title: 'string', cause_explanation: 'string', resolution_steps: 'array of strings', why_this_fix_is_optimal: 'string comparing this solution against temporary patches or other common fixes' }",
    tradeoff_analysis:
      "string (comprehensive deep-dive summary comparing all recommendations, discussing speed vs. cost, security vs. convenience, and scalability tradeoffs to empower the user's decision)",
  },
};

export type SchemaType = keyof typeof NormalizationSchemas;
