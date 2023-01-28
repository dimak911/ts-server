import jwt from "jsonwebtoken";
import config from "config";
import { UserTokenModel } from "../models/user.model";

const secret = config.get<string>("secret");
const tokenTtl = config.get<string>("tokenTtl");

type Payload = {
  userId: string;
  email: string;
  idType: string;
};

export const refreshToken = async (currentToken: string, payload: Payload) => {
  try {
    const { userId } = payload;

    const newToken = jwt.sign(payload, secret, { expiresIn: tokenTtl });

    await UserTokenModel.deleteOne({ userId, token: currentToken });
    await UserTokenModel.create({ userId, token: newToken });

    return newToken;
  } catch (error: any) {
    throw new Error();
  }
};
