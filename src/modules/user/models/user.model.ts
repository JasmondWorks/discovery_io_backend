import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import {
  IUserEntity,
  UserRole,
  ExperienceLevel,
  Industry,
  CoreRole,
} from "../../../modules/user/user.entity";

export interface IUser extends Omit<IUserEntity, "id">, Document {}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
    professionalProfile: {
      industry: {
        type: String,
        enum: Object.values(Industry),
      },
      core_role: {
        type: String,
        enum: Object.values(CoreRole),
      },
      experience_level: {
        type: String,
        enum: Object.values(ExperienceLevel),
      },
      key_skills: [String],
      primary_tools: [String],
      daily_responsibilities: [String],
      current_objectives: [String],
      main_pain_points: [String],
      detailed_context: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Password hashing middleware
userSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Update passwordChangedAt property for the user
userSchema.pre("save", async function (this: any) {
  if (!this.isModified("password") || this.isNew) return;
  this.passwordChangedAt = new Date(Date.now() - 1000);
});

// Instance method to check if password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
