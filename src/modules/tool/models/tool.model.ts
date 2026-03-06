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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Tool = mongoose.model<ITool>("Tool", toolSchema);

export default Tool;
