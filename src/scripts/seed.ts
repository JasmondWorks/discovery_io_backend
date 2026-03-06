import mongoose from "mongoose";
import dotenv from "dotenv";
import Tool from "../modules/tool/models/tool.model";
import config from "../config/app.config";

dotenv.config();

const DB_URI = config.db.url;

import toolsData from "./data/tools.json";

const seedDB = async () => {
  if (!DB_URI) {
    console.error("No Database configured. Cannot run seed.");
    process.exit(1);
  }

  try {
    console.log("Connecting to database...");
    await mongoose.connect(DB_URI);

    console.log("Dropping old Tool collections...");
    await Tool.deleteMany({});

    console.log("Seeding Catalog...");
    await Tool.insertMany(toolsData);

    console.log(
      `Successfully imported ${toolsData.length} tools into the database!`,
    );
    mongoose.connection.close();
  } catch (error) {
    console.error("Error with seeding:", error);
    process.exit(1);
  }
};

seedDB();
