# Deploying an Express.js Backend with Swagger API Docs to Vercel

This guide outlines the complete process required to successfully deploy a TypeScript Express.js backend to Vercel while ensuring that `swagger-ui-express` and `swagger-jsdoc` function correctly in a serverless environment.

## The Problems with Serverless Environments

Vercel is primarily a serverless platform. When you configure an application to run on Vercel, it spins up lightweight lambda functions. This introduces a few hurdles when trying to deploy a persistent Express server with auto-generating Swagger API documentation:

1. **Absolute Imports:** Vercel has issues resolving absolute root path aliases (e.g. `@/modules/*`) natively inside its runtime.
2. **Missing UI Assets:** Swagger UI attempts to render CSS and JavaScript directly out of local `node_modules`, which will result in `404 Not Found` blank screens in production.
3. **Execution Context and Glob Parsing:** `swagger-jsdoc` tries to search via globs based on the root directory to find your endpoints. Vercel bundles only directly-imported code and hides its runtime inside randomized directories, causing the parser to fail entirely.

---

## 1. Eliminate Absolute Path Aliases

If your project utilizes `@/` base URL path aliases for its imports, these generally must be replaced with explicitly defined relative paths (e.g., `../../middlewares/auth.middleware.ts`) before compiling for Vercel.

1. **Update `tsconfig.json`**:
   Remove the `"baseUrl"` and `"paths"` options.
   Add the `"api/**/*"` array to `"include"` so TypeScript knows to parse the new serverless entry file we will build.

   ```json
   {
     "compilerOptions": {
       // ...other configuration
       "outDir": "./dist",
       "rootDir": "./"
       // REMOVED "baseUrl" and "paths"
     },
     "include": ["src/**/*", "api/**/*"]
   }
   ```

2. **Update Scripts in `package.json`**:
   Remove any dependency mapping tools like `tsconfig-paths/register` from your `npm run dev` or `node` execution scripts.
   ```json
   "scripts": {
     "dev": "npx ts-node-dev -r dotenv/config --files src/server.ts"
   }
   ```

---

## 2. Setting Up the Serverless Entry Point

Instead of having Vercel attempt to spin up a long-running Express web socket, you must expose your API as an executable function module.

Create a new folder and file at the highest root directory: `/api/index.ts`

```typescript
// api/index.ts
import app from "../src/app";

export default app;
```

_Note: This strictly exports the assembled `Express` object instance rather than executing `app.listen(port)`._

---

## 3. Configuring Vercel Routing

Create a `vercel.json` file in the root of your project directory.

Vercel needs to know to proxy all routes `/(.*)` explicitly through the new `/api/index.ts` lambda function. Additionally, because Vercel tree-shakes and removes files it assumes your runtime doesn't directly import as a module, you MUST use the `"functions": { "includeFiles": ... }` property to explicitly package your controller routing files alongside your lambda. This guarantees `swagger-jsdoc` has physical files to scan.

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ],
  "functions": {
    "api/index.ts": {
      "includeFiles": "src/**/*.ts"
    }
  }
}
```

_Note: Do not include the `"builds": []` property inside this modern configuration format, as it will trigger a conflict error._

---

## 4. Serving Swagger Assets via External CDNs

Because Vercel serverless environments cannot serve static assets robustly out of `node_modules`, the default Swagger UI will load as a completely blank white page lacking styling or Javascript interaction files.

You must specifically inject CDN options into the Swagger UI configuration inside your central `src/app.ts` file.

```typescript
// src/app.ts
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";

const app = express();

// Set Swagger to rely on CDN resources for CSS and JS bundling
const swaggerUiOptions = {
  customCssUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-standalone-preset.js",
  ],
};

// Start serving documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions),
);
```

---

## 5. Locating Files Dynamically with Node Path

Finally, because Vercel launches functions in heavily anonymized internal execution paths (like `/var/task...`), giving `swagger-jsdoc` relative string paths (e.g. `./src/routes`) will fail because it does not recognize your local root level as the starting directory.

Update your central Swagger configuration (`src/config/swagger.config.ts`) to use the built-in Node `path` module. Leveraging `__dirname`, it can contextually construct the fully qualified absolute path dynamically based on where the swagger script executes within the lambda instance.

Include patterns for both `.ts` (if raw code is parsed) and `.js` (if transpiled) globs.

```typescript
// src/config/swagger.config.ts
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    // ... basic definitions, servers, and securitySchemes
  },
  // Use absolute relative tracking via __dirname to scan endpoints on any host filesystem
  apis: [
    path.join(__dirname, "../routes/*.ts"),
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../modules/**/*.route.ts"),
    path.join(__dirname, "../modules/**/*.route.js"),
  ],
};

export default swaggerJSDoc(options);
```
