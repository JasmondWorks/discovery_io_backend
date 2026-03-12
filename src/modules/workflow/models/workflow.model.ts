import mongoose, { Schema, Document } from "mongoose";
import { IWorkflowEntity } from "../workflow.entity";

export interface IWorkflow extends Omit<IWorkflowEntity, "id">, Document {}

const workflowSchema = new Schema<IWorkflow>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    complexity: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    use_cases: [
      {
        type: String,
      },
    ],
    steps: [
      {
        type: String,
        required: true,
      },
    ],
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

// Add text index for search
workflowSchema.index({
  title: "text",
  description: "text",
  use_cases: "text",
});

// Required by MongoDB to allow $or queries combining $text and other fields
workflowSchema.index({ use_cases: 1 });

const Workflow = mongoose.model<IWorkflow>("Workflow", workflowSchema);

export default Workflow;
