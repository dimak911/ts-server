import { Request, Response } from "express";
import exec from "child_process";
import { CreateUserInput } from "../schema/user.schema";
import {
  createUser,
  deleteAllUserTokens,
  deleteCurrentUserToken,
  getUserInfo,
  loginUser,
} from "../service/user.service";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);

    return res.send(user);
  } catch (error: any) {
    console.error(error);
    return res.status(409).json(error.message);
  }
};

export const loginUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  try {
    const user = await loginUser(req.body);

    if (!user) {
      return res.status(400).json({ message: "Invalid login or password" });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json(error.message);
  }
};

export const logoutUserHandler = async (req: Request, res: Response) => {
  try {
    const query = req.query;

    if (!query.all) {
      return res
        .status(400)
        .json({ message: "Query param 'all' (type Boolean) is required" });
    }
    const { user } = res.locals;

    if (query.all === "true") {
      await deleteAllUserTokens(user);

      return res.status(200).json("All tokens deleted");
    } else if (query.all === "false") {
      await deleteCurrentUserToken(user);

      return res.status(200).json("Current token deleted");
    } else {
      throw new Error();
    }
  } catch (error: any) {
    console.error(error);
    return res.status(400).json(error.message);
  }
};

export const getUserInfoHandler = async (req: Request, res: Response) => {
  try {
    const { user } = res.locals;

    const userInfo = await getUserInfo(user);

    res.status(200).json({ userInfo, token: user.token });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json(error.message);
  }
};

export const getLatencyHandler = async (req: Request, res: Response) => {
  try {
    const { user } = res.locals;

    exec.exec("ping -c 3 8.8.8.8", function (err, stdout, stderr) {
      if (err) throw new Error();

      console.log("stdout: ", stdout);

      res.status(200).json({ latency: stdout, token: user.token });
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json(error.message);
  }
};
