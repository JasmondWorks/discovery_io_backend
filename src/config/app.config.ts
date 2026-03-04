const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  debug: process.env.APP_DEBUG === "true",
  db: {
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/discover_io",
  },
  jwt: {
    accessSecret: process.env.ACCESS_SECRET || "access-secret-key-123",
    refreshSecret: process.env.REFRESH_SECRET || "refresh-secret-key-123",
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "1h",
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
  },
  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL || "admin@example.com",
    password: process.env.SUPER_ADMIN_PASSWORD || "admin123",
  },
  ai: {
    openAiApiKey: process.env.OPENAI_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    openRouteApiKey: process.env.OPEN_ROUTE_API_KEY,
    defaultProvider: process.env.AI_DEFAULT_PROVIDER || "openai",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

export default config;
