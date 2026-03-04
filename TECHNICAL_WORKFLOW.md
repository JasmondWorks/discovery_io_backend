# Technical Execution Workflow - Discover.io

This document outlines the step-by-step technical plan to evolve the current normalization system into the full **Discover.io** platform.

## 🏗️ Phase 1: Core Tool Infrastructure (Seeding & Schema)

The system "cannot recommend what it doesn't know."

### 1. Tool Database Schema

Implement a robust MongoDB schema for AI tools.

- **Fields**: `name`, `slug`, `category`, `description`, `pricing_model` (free/freemium/paid), `verified_use_cases` (array), `platform` (web/ios/android), `ranking_score`, `metadata` (tags, website URL).
- **Technicality**: Indexing on `category` and `verified_use_cases` for fast retrieval.

### 2. Manual Seeding Script

A utility to seed the initial 50-100 high-quality tools as per PRD requirement.

- **Workflow**: `src/scripts/seed-tools.ts`.
- **Recommendation**: Use a JSON file as the source of truth for the manual seed to allow easy updates without code changes.

---

## 🔍 Phase 2: The "Diagnosis" Engine (Advanced Normalization)

Refining the current normalization into the "Feature 5: Clarification" feature.

### 3. Diagnosis Schema Update

Update `NormalizationSchemas` to include a `diagnosis` type.

- **Technicality**: The schema must extract:
  - `user_persona` (e.g., 'Senior Backend Dev')
  - `core_task` (e.g., 'Schema Migration')
  - `success_criteria` (e.g., 'Must support SQL export')
- **Workflow**: The frontend calls `POST /normalize/diagnosis`. The system returns the extracted attributes.

### 4. Interactive Confirmation Flow

Implementing the "Restate and Confirm" logic.

- **Workflow**: Backend stores the pending diagnosis in a temporary `DiscoverySession` collection (associated with the user) or returns it to the frontend.
- **Workflow**: Frontend displays the 3 attributes. User clarifies or confirms.

---

## ⚡ Phase 3: Recommendation & Ranking Logic

The heart of the product.

### 5. Multi-Step Discovery Service

After user confirmation, the system must:

1.  **Filter**: Query the DB for tools matching the `category` and `use_cases` identified in the diagnosis.
2.  **Rank**: Use the AI to compare the _confirmed diagnosis_ against the _filtered database results_.
3.  **Output**: Generate the "Comparative Leaderboard" and ranking explanations.

- **Constraint**: The AI must ONLY recommend tools from the internal DB to prevent hallucinations.

### 6. Trade-off Generator

A specific AI prompt to identify one "Trade-off" or "Limitation" for the #1 ranked tool.

- **Recommendation**: Store common limitations in the DB metadata to feed the AI, ensuring balanced advice.

---

## 🚀 Phase 4: Performance & Scalability (Caching & Cost)

Addressing the "Free Model" and "Caching" requirements.

### 7. Global Redis Caching (Recommended)

Implement a caching layer for the discovery endpoints.

- **Strategy**: Cache by hashing the `input` + `user_persona`.
- **Technicality**: If the same persona asks about the same problem, return the cached diagnosis and results instantly.
- **Cost Saving**: Prevents expensive/slow re-normalization for common queries.

### 8. Free Model Implementation

- **Gemini Support**: leverage the existing `GeminiProvider` using `gemini-2.0-flash` for ultra-low latency and zero cost for testing/initial launch.
- **Local Model (Optional)**: If the user wants 100% free/offline, a Llama 3 (8B) instance via Ollama/vLLM could be integrated as a provider.

---

## ✅ Phase 5: Verification & Launch

- **End-to-End Testing**: Testing the `Search → Clarify → Confirm → Ranked Results` flow.
- **Seeding Validation**: Ensuring no hallucinations occur (AI must only pick DB tools).
- **Load Testing**: Verifying 20+ concurrent users handling discovery flows.
