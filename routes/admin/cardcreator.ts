import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";

const router = Router();

router.get(
  "/api/menu",
  async (req: Request, res: Response, next: NextFunction) => {
    let user_info = res.locals.user_info;
    let bot_info = res.locals.bot_info;
    if (!user_info.allowed) return next(new createHttpError.Forbidden());

    res.status(200).render("Menu", { user_info, bot_info });
  }
);

export default router;
