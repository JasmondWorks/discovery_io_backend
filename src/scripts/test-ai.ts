import "dotenv/config";
import { NormalizationService } from "../modules/normalization/normalization.service";

async function testNormalization() {
  const service = new NormalizationService();
  const provider = "gemini";

  const professionInput = `
    I am a freelance graphic designer specializing in brand identity for sustainable startups. 
    I've been doing this for 8 years. I mainly use Adobe Creative Cloud, Figma, and Notion for project management. 
    My typical day involves sketching concepts, meeting with clients over Zoom, and refining vectors. 
  `;

  console.log(`Testing Normalization performance optimizations...`);

  try {
    console.log("\n--- First Call (Prompt Optimization) ---");
    const start1 = Date.now();
    const result1 = await service.normalizeInput({
      input: professionInput,
      schemaType: "professional_profile" as any,
      provider: provider,
    });
    const end1 = Date.now();
    console.log(`Time taken: ${end1 - start1}ms`);
    // console.log(JSON.stringify(result1, null, 2));

    console.log("\n--- Second Call (Cache Optimization) ---");
    const start2 = Date.now();
    const result2 = await service.normalizeInput({
      input: professionInput,
      schemaType: "professional_profile" as any,
      provider: provider,
    });
    const end2 = Date.now();
    console.log(`Time taken: ${end2 - start2}ms`);

    if (end2 - start2 < 50) {
      console.log("SUCCESS: Cache hit confirmed (response < 50ms)!");
    } else {
      console.log("WARNING: Cache might have missed.");
    }
  } catch (error: any) {
    console.error("Test Failed:", error.message);
  }
}

testNormalization();
