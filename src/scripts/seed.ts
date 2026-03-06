import mongoose from "mongoose";
import dotenv from "dotenv";
import Tool from "../modules/tool/models/tool.model";
import Workflow from "../modules/workflow/models/workflow.model";
import Solution from "../modules/solution/models/solution.model";
import config from "../config/app.config";

dotenv.config();

const DB_URI = config.db.url;

import toolsData from "./data/tools.json";
import workflowsData from "./data/workflows.json";
import solutionsData from "./data/solutions.json";

const seedDB = async () => {
  if (!DB_URI) {
    console.error("No Database configured. Cannot run seed.");
    process.exit(1);
  }

  try {
    console.log("Connecting to database...");
    await mongoose.connect(DB_URI);

    console.log("Dropping old collections...");
    await Tool.deleteMany({});
    await Workflow.deleteMany({});
    await Solution.deleteMany({});

    console.log("Seeding Catalog...");
    await Tool.insertMany(toolsData);
    await Workflow.insertMany(workflowsData);
    await Solution.insertMany(solutionsData);

    console.log(
      `Successfully imported ${toolsData.length} tools, ${workflowsData.length} workflows, and ${solutionsData.length} solutions into the database!`,
    );
    mongoose.connection.close();
  } catch (error) {
    console.error("Error with seeding:", error);
    process.exit(1);
  }
};

seedDB();
