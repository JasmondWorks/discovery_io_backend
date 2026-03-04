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
};

export type SchemaType = keyof typeof NormalizationSchemas;
