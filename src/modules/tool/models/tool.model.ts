import mongoose, { Schema, Document } from "mongoose";
import { IToolEntity } from "../tool.entity";

export interface ITool extends Omit<IToolEntity, "id">, Document {}

const toolSchema = new Schema<ITool>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    pricing: {
      type: String,
      required: true,
      default: "Freemium",
    },
    platform: {
      type: String,
      required: true,
      default: "Web",
    },
    verified_use_cases: [
      {
        type: String,
      },
    ],
    /**
     * High-level category for the Tools Catalog (PRD Feature 3).
     * Used to group tools by skill area (e.g. "Design", "Writing", "Development").
     */
    category: {
      type: String,
    },
    /**
     * Role/industry tags for personalized catalog filtering.
     * Allows GET /tools/for-me to return tools relevant to the user's core role.
     */
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Add text index for search
toolSchema.index({
  name: "text",
  description: "text",
  category: "text",
  verified_use_cases: "text",
  tags: "text",
});

// Required by MongoDB to allow $or queries combining $text and other fields
toolSchema.index({ tags: 1 });

const Tool = mongoose.model<ITool>("Tool", toolSchema);

export default Tool;
