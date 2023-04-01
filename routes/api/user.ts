import * as types from "@types";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";

const router = Router();

router.get(
  "/api/users/get/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    let user_info: types.users_discord_info_obj = res.locals.user_info;
    let bot_info: types.users_discord_info_obj = res.locals.bot_info;
  }
);

router.get(
  "/api/users/@me",
  async (req: Request, res: Response, next: NextFunction) => {
    let user_info: types.users_discord_info_obj = res.locals.user_info;
    let bot_info: types.users_discord_info_obj = res.locals.bot_info;
  }
);

export default router;
