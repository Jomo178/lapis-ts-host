import { Client } from "@models";
import * as types from "@types";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";

const router = Router();

// router.get(
//   "/api/staff/get/events",
//   async (req: Request, res: Response, next: NextFunction) => {
//     let user_info: types.users_discord_info_obj = res.locals.user_info;
//     let bot_info: types.users_discord_info_obj = res.locals.bot_info;
//     if (user_info.type != "Developer" && user_info.type != "Head-Card-Creator")
//       return next(new createHttpError.Forbidden());

//     res.status(200).render("Events", { user_info, bot_info });
//   }
// );

router.post(
  "/api/staff/get/events",
  async (req: Request, res: Response, next: NextFunction) => {
    let user_info: types.users_discord_info_obj = res.locals.user_info;
    let bot_info: types.users_discord_info_obj = res.locals.bot_info;
    if (user_info.type != "Developer" && user_info.type != "Head-Card-Creator")
      return next(new createHttpError.Forbidden());

    const { name, start, end, emoji, required } = req.body;

    const findClient = await Client.findOne({ userID: bot_info.id });
    if (!findClient)
      return res.send({ status: 400, message: "Something went wrong." });

    if (!findClient.events) findClient.events = [];

    let findEvent = findClient.events?.find((event) => event.name == name);
    if (findEvent)
      return res.send({ status: 400, message: "The event already exists." });

    findClient.events.push({
      name,
      start,
      end,
      emoji,
      required,
      finished: false,
    });

    await findClient.save();
    return res.send({ status: 200, message: "Added Successfully" });
  }
);

export default router;
