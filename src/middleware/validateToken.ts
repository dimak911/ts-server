import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "config";
import { UserTokenModel } from "../models/user.model";
import { refreshToken } from "../utils/refreshToken";

interface JwtPayload {
  userId: string;
  email: string;
  idType: string;
  createdAt: Date;
  updatedAt: Date;
}

const secret = config.get<string>("secret");

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || " ";
  const [bearer, token] = authHeader.split(" ");

  if (bearer === "Bearer" && token) {
    try {
      const result = jwt.verify(token, secret) as JwtPayload;

      if (!result) {
        throw new Error();
      }

      const isTokenExists = await UserTokenModel.findOne({
        userId: result.userId,
        token,
      });

      if (!isTokenExists) {
        throw new Error();
      }

      const payload = {
        userId: result.userId,
        email: result.email,
        idType: result.idType,
      };

      const newToken = await refreshToken(token, payload);

      res.locals.user = {
        userId: result.userId,
        token: newToken,
        currentToken: token,
      };

      next();
    } catch (error: any) {
      if (error.message === "Invalid signature") {
        error.status = 401;
      }
      error.message = "Not authorized";
      error.status = 401;
      next(error);
    }
  }
};
