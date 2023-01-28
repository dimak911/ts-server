import { Express, Request, Response } from "express";
import {
  createUserHandler,
  getLatencyHandler,
  getUserInfoHandler,
  loginUserHandler,
  logoutUserHandler,
} from "./controller/user.controller";
import validate from "./middleware/validateResource";
import { createUserSchema } from "./schema/user.schema";
import { validateToken } from "./middleware/validateToken";

const routes = (app: Express) => {
  app.get("/", (req: Request, res: Response) => {
    return res.status(200).json("Works!");
  });

  app.post("/signup", validate(createUserSchema), createUserHandler);

  app.post("/signin", validate(createUserSchema), loginUserHandler);

  app.get("/logout", validateToken, logoutUserHandler);

  app.get("/info", validateToken, getUserInfoHandler);

  app.get("/latency", validateToken, getLatencyHandler);
};

export default routes;
