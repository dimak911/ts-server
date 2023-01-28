import { Schema, model, Document } from "mongoose";

export interface UserInput {
  email: string;
  password: string;
}

export interface UserDocument extends UserInput, Document {
  id_type: string;
  createdAt: Date;
  updatedAt: Date;
}

const user = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    id_type: {
      type: String,
      default: "email",
    },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("user", user);

export interface UserTokenDocument extends Document {
  userId: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

const userToken = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserTokenModel = model<UserTokenDocument>("userToken", userToken);
