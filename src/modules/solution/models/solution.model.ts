import mongoose, { Schema, Document } from "mongoose";
import { ISolutionEntity } from "../solution.entity";

export interface ISolution extends Omit<ISolutionEntity, "id">, Document {}

const solutionSchema = new Schema<ISolution>(
  {
    issue_title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    cause_explanation: {
      type: String,
      required: true,
    },
    resolution_steps: [
      {
        type: String,
        required: true,
      },
    ],
    tradeoffs: {
      type: String,
      required: true,
    },
    recommended_tools: [
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

const Solution = mongoose.model<ISolution>("Solution", solutionSchema);

export default Solution;
