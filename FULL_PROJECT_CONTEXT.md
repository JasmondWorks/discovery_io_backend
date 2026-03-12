# Discover.io Backend — Full Project Context Export

> **Purpose**: This document contains the complete context of the Discover.io backend project. Feed this to an AI assistant to get help continuing development.
> **Generated**: 2026-03-09

---

## TABLE OF CONTENTS

1. [Product Overview (PRD Summary)](#1-product-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Architecture Pattern](#3-architecture-pattern)
4. [Project Structure](#4-project-structure)
5. [Configuration Files](#5-configuration-files)
6. [Entry Points](#6-entry-points)
7. [Core Utilities](#7-core-utilities)
8. [Middlewares](#8-middlewares)
9. [Modules (Full Source Code)](#9-modules)
   - 9.1 AI Module (Provider Pattern)
   - 9.2 Auth Module
   - 9.3 User Module
   - 9.4 Chat Module (Core Discovery Flow)
   - 9.5 Tool Module (Catalog)
   - 9.6 Normalization Module
   - 9.7 Bookmark Module
   - 9.8 Workflow Module
   - 9.9 Solution Module
   - 9.10 Media Module (Cloudinary)
10. [API Routes Summary](#10-api-routes-summary)
11. [Database Seed Data](#11-database-seed-data)
12. [Deployment (Vercel)](#12-deployment)
13. [Known Issues & Seed Error](#13-known-issues)
14. [Technical Concerns & Risks](#14-technical-concerns--risks)
15. [Technical Execution Roadmap](#15-technical-execution-roadmap)
16. [Environment Variables](#16-environment-variables)

---

## 1. PRODUCT OVERVIEW

**Discover.io** is an AI-powered discovery platform that helps creatives find specific AI tools for their use cases.

**Target Users**: Designers, Developers, Writers, Marketers, Online Professionals

**Value Proposition**: Context-driven, personalized tool recommendations (not generic lists).

### Core PRD Features:

1. **Signup/Login** — Email-based auth with JWT
2. **Onboarding Flow** — Questions to understand user's role, tools, pain points → builds `professionalProfile`
3. **Skills/Tools Catalog** — Personalized list of tools based on user's profile (can skip to search)
4. **Search Input** — Natural language: "Tell me what you need"
5. **Clarification (Diagnosis)** — System extracts: `User Persona`, `Core Task`, `Success Criteria` — user confirms or corrects
6. **Tool Recommendations** — Comparative Leaderboard ranked by Usefulness, Relevance, Reliability. Must include trade-offs.

### Key Constraints:

- AI must ONLY recommend tools from the verified internal database (no hallucinations)
- Search results within 5 seconds of confirmation
- Minimum 5 tools per search result
- Database seeded with 50-100 high-quality AI tools (currently 65)

---

## 2. TECH STACK & DEPENDENCIES

### package.json

```json
{
  "name": "discover_io_backend",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "start": "node dist/src/server.js",
    "build": "npx tsc",
    "dev": "npx ts-node-dev -r dotenv/config --files src/server.ts",
    "seedData": "npx ts-node -r dotenv/config src/scripts/seed.ts",
    "seedAdmin": "npx ts-node -r dotenv/config src/scripts/seeding/super-admin.seeder.ts"
  },
  "dependencies": {
    "@google/genai": "^1.42.0",
    "@google/generative-ai": "^0.24.1",
    "bcrypt": "^6.0.0",
    "cloudinary": "^1.41.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "express-validator": "^7.3.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.2.1",
    "ms": "^2.1.3",
    "multer": "^1.4.2",
    "multer-storage-cloudinary": "^4.0.0",
    "openai": "^6.22.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1"
  },
  "devDependencies": {
    "@faker-js/faker": "^10.3.0",
    "@types/bcrypt": "^6.0.0",
    "@types/cookie-parser": "^1.4.10",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/ms": "^2.1.0",
    "@types/multer": "^2.0.0",
    "@types/node": "^25.2.3",
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.8",
    "ts-node-dev": "^2.0.0",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.9.3"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./",
    "typeRoots": ["./node_modules/@types"]
  },
  "include": ["src/**/*", "api/**/*"]
}
```

**NOTE**: No `@/` path aliases in imports (removed for Vercel compatibility). All imports use relative paths.

---

## 3. ARCHITECTURE PATTERN

**Modular Repository Pattern** with Express + TypeScript + MongoDB (Mongoose)

### Request Flow:

```
Client Request → app.ts → routes/v1.route.ts → Module Route → protect (JWT) → restrictTo (role guard) → validator → validateRequest → Controller → Service → MongooseRepository → MongoDB
```

### Module Structure:

Each module has: `entity.ts` → `model.ts` → `service.ts` → `controller.ts` → `validator.ts` → `route.ts`

### Class Dependency Graph:

```
Route → Controller (class) → Service (class) → MongooseRepository (class) → Mongoose Model
```

---

## 4. PROJECT STRUCTURE

```
discover_io_backend/
├── api/
│   └── index.ts                      # Vercel serverless entry point
├── src/
│   ├── app.ts                         # Express app configuration
│   ├── server.ts                      # HTTP server start
│   ├── config/
│   │   ├── app.config.ts              # Centralized env config
│   │   ├── db.config.ts               # MongoDB connection
│   │   └── swagger.config.ts          # OpenAPI spec (with component schemas)
│   ├── middlewares/
│   │   ├── auth.middleware.ts          # protect + restrictTo
│   │   ├── error.middleware.ts         # Global error handler
│   │   └── validate-request.middleware.ts
│   ├── utils/
│   │   ├── api-features.util.ts       # Filter, sort, paginate, search
│   │   ├── api-response.util.ts       # ApiResponse + sendSuccess
│   │   ├── app-error.util.ts          # AppError class
│   │   ├── catch-async.util.ts        # Async wrapper
│   │   └── crud.util.ts               # IBaseRepository + MongooseRepository
│   ├── routes/
│   │   └── v1.route.ts                # Central route aggregator
│   ├── modules/
│   │   ├── ai/                        # AI provider pattern (OpenAI, Gemini, OpenRouter)
│   │   ├── auth/                      # Registration, Login, JWT, Refresh, Logout
│   │   ├── user/                      # User CRUD, Professional Profile, Onboarding
│   │   ├── chat/                      # Core discovery flow (sessions + messages)
│   │   ├── tool/                      # AI tool catalog + personalized recommendations
│   │   ├── normalization/             # AI-powered text-to-structured-data
│   │   ├── bookmark/                  # Save recommended tools
│   │   ├── workflow/                  # Best-practice workflow guides
│   │   ├── solution/                  # Common issue solutions
│   │   └── media/                     # Cloudinary file uploads
│   └── scripts/
│       ├── seed.ts                    # Master seeder
│       ├── data/
│       │   ├── tools.json             # 65 AI tools
│       │   ├── workflows.json         # 5 workflows
│       │   └── solutions.json         # 4 solutions
│       └── seeding/
│           └── super-admin.seeder.ts
├── .env
├── vercel.json
├── package.json
└── tsconfig.json
```

---

## 5. CONFIGURATION FILES

### src/config/app.config.ts

```typescript
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
    openRouterApiKey: process.env.OPEN_ROUTE_API_KEY,
    defaultProvider: process.env.AI_DEFAULT_PROVIDER || "openai",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

export default config;
```

### src/config/db.config.ts

```typescript
import mongoose from "mongoose";
import config from "../config/app.config";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.db.url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
```

---

## 6. ENTRY POINTS

### src/app.ts

```typescript
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db.config";
import v1Routes from "./routes/v1.route";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { AppError } from "./utils/app-error.util";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";

const app = express();
connectToDatabase();

app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const swaggerUiOptions = {
  customCssUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-standalone-preset.js",
  ],
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions),
);
app.use("/api/v1", v1Routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Discover IO API!");
});
app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

export default app;
```

### src/server.ts

```typescript
import app from "./app";
import config from "./config/app.config";
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
});
```

### api/index.ts (Vercel entry)

```typescript
import app from "../src/app";
export default app;
```

### vercel.json

```json
{
  "version": 2,
  "routes": [{ "src": "/(.*)", "dest": "api/index.ts" }],
  "functions": { "api/index.ts": { "includeFiles": "src/**/*.ts" } }
}
```

---

## 7. CORE UTILITIES

### src/utils/app-error.util.ts

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### src/utils/catch-async.util.ts

```typescript
import { NextFunction, Request, Response } from "express";

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
```

### src/utils/api-response.util.ts

```typescript
import { Response } from "express";

export class ApiResponse {
  public readonly success: boolean;
  constructor(
    public readonly statusCode: number,
    public readonly data: any,
    public readonly message: string = "Success",
  ) {
    this.success = statusCode < 400;
  }
}

export const sendSuccess = (
  res: Response,
  data: any,
  message = "Success",
  statusCode = 200,
) => {
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, data, message));
};
```

### src/utils/crud.util.ts (Repository Pattern)

```typescript
import { Document, Model } from "mongoose";
import { ApiFeatures } from "../utils/api-features.util";

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  createMany(data: Partial<T>[]): Promise<T[]>;
  findAll(
    queryParams?: Record<string, any>,
    filter?: Record<string, any>,
    searchFields?: string[],
    populate?: any,
  ): Promise<PaginatedResult<T>>;
  findById(id: string, select?: string): Promise<T | null>;
  findOne(filter: Record<string, any>, select?: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  deleteMany(filter: Record<string, any>): Promise<boolean>;
}

export class MongooseRepository<
  T extends Document,
> implements IBaseRepository<T> {
  private _model: Model<T>;
  constructor(model: Model<T>) {
    this._model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this._model.create(data);
  }
  async createMany(data: Partial<T>[]): Promise<T[]> {
    return (await this._model.insertMany(data)) as unknown as T[];
  }

  async findAll(
    queryParams: Record<string, any> = {},
    filter: Record<string, any> = {},
    searchFields: string[] = [],
    populate?: any,
  ): Promise<PaginatedResult<T>> {
    const queryBuilder = this._model.find(filter);
    const features = new ApiFeatures(queryBuilder, queryParams)
      .filter()
      .sort()
      .limitFields()
      .search(searchFields);
    const total = await (features.query.clone() as any).countDocuments();
    features.paginate();
    if (populate) features.query.populate(populate);
    const data = await features.query.exec();
    const page = (queryParams.page as number) * 1 || 1;
    const limit = (queryParams.limit as number) * 1 || 10;
    const totalPages = Math.ceil(total / limit);
    return { data, page, limit, total, totalPages };
  }

  async findById(id: string, select?: string): Promise<T | null> {
    const query = this._model.findById(id);
    if (select) query.select(select);
    return await query.exec();
  }

  async findOne(
    filter: Record<string, any>,
    select?: string,
  ): Promise<T | null> {
    const query = this._model.findOne(filter);
    if (select) query.select(select);
    return await query.exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this._model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<boolean> {
    return !!(await this._model.findByIdAndDelete(id));
  }
  async deleteMany(filter: Record<string, any>): Promise<boolean> {
    return (await this._model.deleteMany(filter)).acknowledged;
  }
}
```

### src/utils/api-features.util.ts

```typescript
import { Query } from "mongoose";

export class ApiFeatures {
  public query: Query<any, any>;
  private queryString: Record<string, any>;

  constructor(query: Query<any, any>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
      "startDate",
      "endDate",
    ];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);

    if (this.queryString.startDate || this.queryString.endDate) {
      parsedQuery.createdAt = {};
      if (this.queryString.startDate)
        parsedQuery.createdAt.$gte = new Date(
          this.queryString.startDate as string,
        );
      if (this.queryString.endDate)
        parsedQuery.createdAt.$lte = new Date(
          this.queryString.endDate as string,
        );
    }

    if (this.queryString.deleted === "true") {
      parsedQuery.deletedAt = { $ne: null };
    } else if (this.queryString.deleted === "all") {
      /* show all */
    } else {
      parsedQuery.deletedAt = null;
    }

    this.query = this.query.find(parsedQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = (this.queryString.fields as string).split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = (this.queryString.page as number) * 1 || 1;
    const limit = (this.queryString.limit as number) * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  search(searchFields: string[]) {
    if (this.queryString.search && searchFields.length > 0) {
      const searchTerms = (this.queryString.search as string).split(" ");
      const searchQueries = searchFields.map((field) => ({
        [field]: { $regex: searchTerms.join("|"), $options: "i" },
      }));
      this.query = this.query.find({ $or: searchQueries });
    }
    return this;
  }
}
```

---

## 8. MIDDLEWARES

### src/middlewares/auth.middleware.ts

```typescript
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/app.config";
import { AppError } from "../utils/app-error.util";
import User, { IUser } from "../modules/user/models/user.model";
import { UserRole } from "../modules/user/user.entity";
import { catchAsync } from "../utils/catch-async.util";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const protect = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    if (!token)
      return next(
        new AppError(
          "You are not logged in! Please log in to get access.",
          401,
        ),
      );

    const decoded = jwt.verify(token, config.jwt.accessSecret) as any;
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401,
        ),
      );

    // @ts-ignore
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401,
        ),
      );
    }
    req.user = currentUser;
    next();
  },
);

export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
};
```

### src/middlewares/error.middleware.ts

```typescript
import { NextFunction, Request, Response } from "express";
import config from "../config/app.config";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (config.env === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    if (err.isOperational) {
      res
        .status(err.statusCode)
        .json({ status: err.status, message: err.message });
    } else {
      console.error("ERROR 💥", err);
      res
        .status(500)
        .json({ status: "error", message: "Something went very wrong!" });
    }
  }
};
```

### src/middlewares/validate-request.middleware.ts

```typescript
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../utils/app-error.util";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new AppError(errors.array()[0].msg, 400));
  next();
};
```

---

## 9. MODULES

### 9.1 AI Module (Provider Pattern)

**Interface** — `src/modules/ai/ai.provider.ts`:

```typescript
export interface IAIProvider {
  normalize(input: string, structure: any): Promise<any>;
}
```

**Service** — `src/modules/ai/ai.service.ts`:

```typescript
import { IAIProvider } from "./ai.provider";
import { OpenAIProvider } from "./providers/openai.provider";
import { GeminiProvider } from "./providers/gemini.provider";
import { OpenRouterProvider } from "./providers/openrouter.provider";
import appConfig from "../../config/app.config";
import { AppError } from "../../utils/app-error.util";

export class AIService {
  private providers: Map<string, IAIProvider> = new Map();
  private cache: Map<string, any> = new Map();
  private defaultProvider: string;

  constructor() {
    this.providers.set("openai", new OpenAIProvider());
    this.providers.set("gemini", new GeminiProvider());
    this.providers.set("openrouter", new OpenRouterProvider());
    this.defaultProvider = appConfig.ai.defaultProvider || "openai";
  }

  getProvider(name?: string): IAIProvider {
    const providerName = name || this.defaultProvider;
    const provider = this.providers.get(providerName);
    if (!provider)
      throw new AppError(`AI Provider '${providerName}' not found`, 404);
    return provider;
  }

  async normalize(
    input: string,
    structure: any,
    providerName?: string,
  ): Promise<any> {
    const pName = providerName || this.defaultProvider;
    const cacheKey = `${pName}:${input}:${JSON.stringify(structure)}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);
    const provider = this.getProvider(pName);
    const result = await provider.normalize(input, structure);
    this.cache.set(cacheKey, result);
    return result;
  }
}
```

**Providers** (3 implemented):

**OpenAI** — `providers/openai.provider.ts`: Uses `openai` npm package with `gpt-4o-mini` model.
**Gemini** — `providers/gemini.provider.ts`: Uses `@google/genai` with `gemini-3-flash-preview` model, `responseMimeType: "application/json"`.
**OpenRouter** — `providers/openrouter.provider.ts`: Uses `openai` npm package pointed at `https://openrouter.ai/api/v1` with `google/gemini-2.0-flash-001` model.

All providers implement the same `normalize(input, structure)` method that sends the structure as a system prompt and returns parsed JSON.

---

### 9.2 Auth Module

**Entity Enums** (in user.entity.ts): `UserRole { USER, ADMIN, SUPER_ADMIN }`

**Service** — `src/modules/auth/auth.service.ts`:

```typescript
// Handles: login, register, refresh, logout, createSendToken
// JWT tokens: accessToken (1h) + refreshToken (7d)
// Tokens set as httpOnly cookies + returned in response body
// Refresh token stored in User document (select: false)
```

**Controller** — `src/modules/auth/auth.controller.ts`:

- `POST /auth/register` → register + createSendToken (returns `onboardingCompleted: false`)
- `POST /auth/login` → login + createSendToken
- `POST /auth/refresh` → refresh token (from cookie or body)
- `POST /auth/logout` → clears cookies + removes refreshToken from DB
- `GET /auth/me` → returns `req.user` (requires `protect`)

**Validators**: `registerValidator` (name, email, password min 8), `loginValidator` (email, password)

---

### 9.3 User Module

**Entity** — `src/modules/user/user.entity.ts`:

```typescript
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}
export enum ExperienceLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}
export enum Industry {
  SOFTWARE_DEVELOPMENT = "software_development",
  DESIGN = "design",
  MARKETING = "marketing",
  CONTENT_CREATION = "content_creation",
  OTHER = "other",
}
export enum CoreRole {
  SOFTWARE_ENGINEER = "software_engineer",
  GRAPHIC_DESIGNER = "graphic_designer",
  CONTENT_WRITER = "content_writer",
  PRODUCT_MANAGER = "product_manager",
  MARKETER = "marketer",
  OTHER = "other",
}

export interface IUserEntity {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  passwordChangedAt?: Date;
  refreshToken?: string;
  active: boolean;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  professionalProfile?: {
    industry: Industry;
    core_role: CoreRole;
    experience_level: ExperienceLevel;
    key_skills: string[];
    primary_tools: string[];
    daily_responsibilities: string[];
    current_objectives: string[];
    main_pain_points: string[];
    detailed_context: string;
  };
}
```

**Model** — `src/modules/user/models/user.model.ts`:

- Password hashing with bcrypt (12 rounds) on save
- `correctPassword` instance method
- `changedPasswordAfter` instance method
- `password` and `refreshToken` have `select: false`
- `onboardingCompleted` defaults to `false`

**Routes**:

- `GET /user/me` — get current user (protect)
- `PATCH /user/me/professional-profile` — update professional profile + sets `onboardingCompleted: true`
- `GET /user/` — all users (ADMIN, SUPER_ADMIN)
- `GET /user/:id` — user by ID (ADMIN, SUPER_ADMIN)
- `POST /user/` — create user (SUPER_ADMIN)
- `PATCH /user/:id` — update user (SUPER_ADMIN)
- `DELETE /user/:id` — delete user (SUPER_ADMIN)

---

### 9.4 Chat Module (CORE DISCOVERY FLOW)

**Entity** — `src/modules/chat/chat.entity.ts`:

```typescript
export enum ChatRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}
export enum ChatSessionStatus {
  CLARIFYING = "clarifying",
  ACTIVE = "active",
}

export interface IExtractedIntent {
  user_persona: string;
  core_task: string;
  success_criteria: string;
  original_query: string;
}

export interface IChatSessionEntity {
  id: string;
  user_id: string | Types.ObjectId;
  title: string;
  status: ChatSessionStatus;
  extracted_intent?: IExtractedIntent;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessageEntity {
  id: string;
  chat_session_id: string | Types.ObjectId;
  role: ChatRole;
  content: any; // string or JSON
  createdAt: Date;
  updatedAt: Date;
}
```

**Models**:

- `ChatSession`: `user_id` (ref User), `title`, `status` (default CLARIFYING), `extracted_intent` (subdocument)
- `ChatMessage`: `chat_session_id` (ref ChatSession), `role`, `content` (Mixed type)

**Controller** — `src/modules/chat/chat.controller.ts` (THE CORE LOGIC):

**Two-step PRD flow implemented:**

1. **`POST /chats`** (createChatSession):
   - Creates a session. If `prompt` is provided:
     - Saves user's message
     - Calls `generateClarification(prompt)` → uses `chat_intent` schema to extract `user_persona`, `core_task`, `success_criteria`
     - Saves assistant clarification message
     - Stores `extracted_intent` in session, sets status to `CLARIFYING`

2. **`POST /chats/:id/messages`** (addMessageToSession):
   - If session status is `CLARIFYING`:
     - User is confirming/correcting → calls `generateRecommendations()`
     - Fetches ALL tools, workflows, solutions from DB
     - Builds expert prompt with DB context + user intent
     - Uses `expert_advice` schema to normalize
     - Formats response as Markdown with ranked tools, scores, workflows, solutions, tradeoff analysis
     - Sets session status to `ACTIVE`
   - If session status is `ACTIVE`:
     - If `extracted_intent` exists → directly generates recommendations
     - If no intent → runs clarification first

**Routes**:

- `POST /chats` — create session (with optional initial `prompt`)
- `GET /chats` — list user's sessions (paginated)
- `GET /chats/:id/messages` — get session messages
- `POST /chats/:id/messages` — add message + get AI response

---

### 9.5 Tool Module (Catalog)

**Entity** — `src/modules/tool/tool.entity.ts`:

```typescript
export interface IToolEntity {
  id: string;
  name: string;
  description: string;
  url: string;
  pricing: string;
  platform: string;
  verified_use_cases: string[];
  category?: string; // "Design", "Writing", etc.
  tags?: string[]; // ["graphic_designer", "content_writer"]
  createdAt: Date;
  updatedAt: Date;
}
```

**Model**: `name` (unique), `description`, `url`, `pricing`, `platform`, `verified_use_cases` [String], `category`, `tags` [String]

**Service** — `src/modules/tool/tool.service.ts`:

- `getAllTools(queryParams)` — standard paginated list
- `getToolById(id)`
- `getToolsForUser(user)` — **PRD Feature 3**: Personalized catalog
  - Maps `CoreRole` → relevant use_cases (e.g., `graphic_designer` → `["design", "image_generation", "mockups", ...]`)
  - Maps `Industry` → supplementary use_cases
  - Queries tools matching by `verified_use_cases` OR `tags`
  - Groups results by `category` field
  - Returns `{ grouped: true, role, industry, catalog: { [category]: Tool[] } }`

**Routes**:

- `GET /tools` — all tools (paginated, searchable)
- `GET /tools/for-me` — personalized catalog based on user profile
- `GET /tools/:id` — single tool

---

### 9.6 Normalization Module

**Schemas** — `src/modules/normalization/normalization.schemas.ts`:

```typescript
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
    message: "string (graceful, empathetic introduction...)",
    recommended_tools:
      "array of objects — return a MINIMUM of 5 tools, ranked by relevance. Each object: { name, rationale, usefulness_score (0-100), relevance_score (0-100), reliability_score (0-100), comparison_vs_alternatives, limitation (REQUIRED for #1 ranked) }",
    recommended_workflows:
      "array of objects — up to 2. Each: { title, steps[], advantages_of_this_workflow }",
    recommended_solutions:
      "array of objects — up to 2. Each: { issue_title, cause_explanation, resolution_steps[], why_this_fix_is_optimal }",
    tradeoff_analysis:
      "string (comprehensive deep-dive summary comparing all recommendations)",
  },
};
```

**Service**: Delegates to `AIService.normalize(input, structure, provider)`

**Controller**:

- `POST /normalize` — generic normalization (requires `schemaType`)
- `POST /normalize/profession` — auto-uses `professional_profile` schema + saves to user

---

### 9.7 Bookmark Module

**Entity**: `user_id`, `tool_id?` (optional ref to Tool), `tool_name`, `tool_description`, `tool_url`, `saved_at`

**Model**: Unique compound index on `{ user_id, tool_name }` to prevent duplicates

**Routes**:

- `POST /bookmarks` — save a tool
- `GET /bookmarks` — get user's bookmarks (paginated, searchable)
- `DELETE /bookmarks/:id` — remove bookmark

---

### 9.8 Workflow Module

**Entity**: `title`, `description`, `complexity` (Beginner/Intermediate/Advanced), `use_cases[]`, `steps[]`, `recommended_tools[]`

**Routes** (read-only):

- `GET /workflows` — all workflows
- `GET /workflows/:id` — single workflow

---

### 9.9 Solution Module

**Entity**: `issue_title`, `description`, `tags[]`, `cause_explanation`, `resolution_steps[]`, `tradeoffs`, `recommended_tools[]`

**Routes** (read-only):

- `GET /solutions` — all solutions
- `GET /solutions/:id` — single solution

---

### 9.10 Media Module (Cloudinary)

Uploads files to Cloudinary using `multer-storage-cloudinary`.

**Route**: `POST /media/upload` (multipart/form-data, field name: `file`)

---

## 10. API ROUTES SUMMARY

```
# Auth (public)
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me              (protected)

# Users (protected)
GET    /api/v1/user/me
PATCH  /api/v1/user/me/professional-profile
GET    /api/v1/user/                (ADMIN+)
GET    /api/v1/user/:id             (ADMIN+)
POST   /api/v1/user/                (SUPER_ADMIN)
PATCH  /api/v1/user/:id             (SUPER_ADMIN)
DELETE /api/v1/user/:id             (SUPER_ADMIN)

# Chat / Discovery (protected)
POST   /api/v1/chats                (create session + initial clarification)
GET    /api/v1/chats                (list sessions)
GET    /api/v1/chats/:id/messages   (get messages)
POST   /api/v1/chats/:id/messages   (add message + AI response)

# Tools Catalog (protected)
GET    /api/v1/tools                (all tools, paginated)
GET    /api/v1/tools/for-me         (personalized catalog)
GET    /api/v1/tools/:id

# Normalization (protected)
POST   /api/v1/normalize            (generic, requires schemaType)
POST   /api/v1/normalize/profession (auto professional_profile)

# Bookmarks (protected)
POST   /api/v1/bookmarks
GET    /api/v1/bookmarks
DELETE /api/v1/bookmarks/:id

# Workflows (protected, read-only)
GET    /api/v1/workflows
GET    /api/v1/workflows/:id

# Solutions (protected, read-only)
GET    /api/v1/solutions
GET    /api/v1/solutions/:id

# Media (protected)
POST   /api/v1/media/upload

# System
GET    /api/v1/health
GET    /                            (welcome message)
GET    /health
GET    /api-docs                    (Swagger UI)
```

---

## 11. DATABASE SEED DATA

### Tools (65 entries in tools.json)

Sample entries include: ChatGPT, Claude 3.5 Sonnet, Midjourney, GitHub Copilot, Notion AI, Jasper, Figma AI, Cursor, Writesonic, Vercel v0, Canva Magic Studio, Perplexity AI, Runway Gen-3 Alpha, ElevenLabs, Uizard, Lovable, Bolt.new, Copy.ai, Synthesia, Descript, Gamma, Relume, Suno, Fathom, Zapier Central, Devin, Framer AI, Leonardo.ai, Luma Dream Machine, Otter.ai, Beautiful.ai, Opus Clip, Veed.io, Khroma, Superhuman AI, Mem, Looka, Webflow AI, GrammarlyGO, Surfer SEO, Adobe Firefly, and many more.

Each tool has: `name`, `description`, `url`, `pricing`, `platform`, `verified_use_cases[]`

### Workflows (5 entries)

1. Fullstack Next.js 14 Application Authentication with NextAuth
2. OAuth and Magic Links for React + Node.js/Express Backend
3. CI/CD Pipeline Setup for Frontend Apps via GitHub Actions
4. Designing a Scalable Design System in Figma
5. End-to-end Testing with Playwright

### Solutions (4 entries)

1. CORS Policy Error between Frontend App and Backend API
2. Hydration Mismatch in React/Next.js
3. JSON Web Token (JWT) Expiration Handling without Forced Logouts
4. Choosing Between Vercel Serverless vs Dedicated VPS Deployment

### Seed Script (`npm run seedData`)

Connects to MongoDB, drops `Tool`, `Workflow`, `Solution` collections, then inserts from JSON files.

---

## 12. DEPLOYMENT

**Platform**: Vercel (serverless)
**Production URL**: `https://discovery-io-backend.vercel.app`
**Database**: MongoDB Atlas (cluster: `cluster0.oaqi4fa.mongodb.net`)

Key deployment considerations:

- No `@/` path aliases (removed for Vercel compatibility)
- Swagger UI uses CDN assets (not local node_modules)
- `swagger-jsdoc` uses `path.join(__dirname, ...)` for absolute paths
- `api/index.ts` exports the Express app (not `app.listen()`)
- `vercel.json` includes `src/**/*.ts` in functions

---

## 13. KNOWN ISSUES

### Seed Error (seed_error.log)

```
Error with seeding: ValidationError: Solution validation failed: issue_title: Path `issue_title` is required.
```

This suggests a previous version of the solutions data had entries missing the `issue_title` field. The current `solutions.json` has been fixed and all entries have `issue_title`.

---

## 14. TECHNICAL CONCERNS & RISKS

1. **Zero-Hallucination Guardrails**: AI must ONLY recommend tools from the verified DB. Current implementation sends all DB tools in the prompt context. Backend should strip any tool IDs not in DB results.

2. **Latency Stack-up**: Multi-step AI flow (Diagnosis → Confirmation → Ranking) could exceed 5-second goal. Mitigations: Use fast models (Gemini Flash), implement predictive caching, use streaming responses.

3. **Scalable Tool Retrieval**: Keyword/tag matching works for 100 tools but fails at 1000+. Future: Transition to vector search (RAG) with embeddings.

4. **Discovery Session State**: Currently stored in MongoDB (`ChatSession.extracted_intent`). For scale, consider Redis session store.

5. **Cache Invalidation**: In-memory cache (`Map`) in `AIService` doesn't persist across restarts and has no invalidation. Future: Redis with event-driven invalidation.

6. **Prompt Injection**: User could try to inject malicious prompts. Backend must validate final filtered IDs against vetted DB results.

7. **Cost of Multi-Step Inference**: 2-3 AI calls per discovery. Optimize by using smallest model for diagnosis, larger for ranking.

---

## 15. TECHNICAL EXECUTION ROADMAP

### Phase 1: Core Tool Infrastructure ✅ (DONE)

- Tool schema with `category`, `tags`, `verified_use_cases`
- 65 tools seeded from JSON

### Phase 2: Diagnosis Engine ✅ (DONE)

- `chat_intent` normalization schema
- `ChatSession` with `extracted_intent` and `status` (CLARIFYING/ACTIVE)
- Interactive confirmation flow

### Phase 3: Recommendation & Ranking ✅ (DONE)

- Multi-step discovery service in `ChatController`
- Expert advice schema with tools, workflows, solutions, tradeoff analysis
- DB-constrained recommendations (tools fetched from DB, passed as context)

### Phase 4: Performance & Scalability (NOT STARTED)

- Redis caching layer
- Streaming responses
- Cost optimization (model selection per step)

### Phase 5: Verification & Launch (NOT STARTED)

- End-to-end testing
- Seeding validation (no hallucinations)
- Load testing (20+ concurrent users)

---

## 16. ENVIRONMENT VARIABLES

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=<your_mongodb_connection_string>
ACCESS_SECRET=<your_jwt_access_secret>
REFRESH_SECRET=<your_jwt_refresh_secret>
JWT_ACCESS_TOKEN_EXPIRES_IN=1h
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:3000
OPENAI_API_KEY=<your_openai_key>
GEMINI_API_KEY=<your_gemini_key>
OPEN_ROUTE_API_KEY=<your_openrouter_key>
# Cloudinary (optional, for media uploads)
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

---

**END OF CONTEXT EXPORT**
