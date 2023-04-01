import * as functions from "@functions";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/stats", async (req: Request, res: Response) => {
  let user_info = res.locals.user_info;
  const bot_info = await functions.fetch_bots_data();

  user_info.avatar = functions.check.avatar(user_info);
  bot_info.avatar = functions.check.avatar(bot_info);

  user_info = await functions.check.CcSee(user_info);

  if (user_info.allowed) {
    res.status(200).render("stats", { user_info, bot_info });
  } else {
    res.send({ msg: "Error you need Permissions!" });
  }
});

export default router;
