import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export interface IUser extends mongoose.Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
  createAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    userId: {
      type: String,
      default: () => nanoid(10),
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    }
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export const UserModel = mongoose.model<IUser>("User", userSchema);
