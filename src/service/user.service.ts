import { DocumentDefinition } from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import jwt from "jsonwebtoken";
import { UserInput, UserModel, UserTokenModel } from "../models/user.model";

const secret = config.get<string>("secret");
const tokenTtl = config.get<number>("tokenTtl");

export const createUser = async (input: DocumentDefinition<UserInput>) => {
  try {
    const salt = await bcrypt.genSalt(config.get<number>("saltRounds"));
    const hashPassword = await bcrypt.hash(input.password, salt);

    const createdUser = await UserModel.create({
      ...input,
      password: hashPassword,
    });

    const payload = {
      userId: createdUser._id,
      email: createdUser.email,
      idType: createdUser.id_type,
    };

    const token = jwt.sign(payload, secret, { expiresIn: tokenTtl });

    await UserTokenModel.create({ userId: createdUser._id, token });

    return { token };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const loginUser = async (input: DocumentDefinition<UserInput>) => {
  try {
    const user = await UserModel.findOne({ email: input.email });

    if (!user) return false;

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) return false;

    const payload = {
      userId: user._id,
      email: user.email,
      idType: user.id_type,
    };
    const token = jwt.sign(payload, secret, { expiresIn: tokenTtl });

    await UserTokenModel.create({ userId: user._id, token });

    return { token };
  } catch (error: any) {
    throw new Error(error);
  }
};

type User = {
  userId: string;
  token: string;
  currentToken: string;
};

export const getUserInfo = async (user: User) => {
  try {
    const userData = await UserModel.findOne(
      { _id: user.userId },
      { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    );

    if (!userData) throw new Error("No such user");

    return userData;
  } catch (error: any) {
    throw new Error();
  }
};

export const deleteAllUserTokens = async (user: User) => {
  try {
    await UserTokenModel.deleteMany({ userId: user.userId });
  } catch (error: any) {
    throw new Error();
  }
};

export const deleteCurrentUserToken = async (user: User) => {
  try {
    await UserTokenModel.findOneAndDelete({ token: user.currentToken });
  } catch (error: any) {
    throw new Error();
  }
};
