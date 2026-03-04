import User from "../../modules/user/models/user.model";
import { UserRole } from "../../modules/user/user.entity";
import config from "../../config/app.config";
import mongoose from "mongoose";

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(config.db.url);
    console.log("Connected to MongoDB for seeding...");

    const adminEmail = config.superAdmin.email;
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Super Admin with email ${adminEmail} already exists.`);
      process.exit(0);
    }

    await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: config.superAdmin.password,
      role: UserRole.SUPER_ADMIN,
    });

    console.log("Super Admin created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Super Admin:", error);
    process.exit(1);
  }
};

seedSuperAdmin();
