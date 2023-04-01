import * as functions from "@functions";
import { Website } from "@models";
import * as types from "@types";
import { NextFunction, Request, Response, Router } from "express";
import { sort } from "fast-sort";
import createHttpError from "http-errors";

let Filter: any = {
  Developer: 5,
  "Head-Card-Creator": 4,
  Support: 3,
  Artist: 2,
  "Card Creator": 1,
};

const router = Router();

// router.get(
//   "/staff",
//   async (req: Request, res: Response, next: NextFunction) => {
//     let user_info: types.users_discord_info_obj = res.locals.user_info;
//     let bot_info: types.users_discord_info_obj = res.locals.bot_info;
//     if (user_info.type != "Developer" && user_info.type != "Head-Card-Creator")
//       return next(new createHttpError.Forbidden());

//     res.status(200).render("staff", { user_info, bot_info });
//   }
// );

router.post(
  "/staff",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    if (id == "every") {
      let staff = await Website.find();
      let newStaff: any = [];

      for (let i = 0; i < staff.length; i++) {
        if (staff[i].type != "member") {
          const staffInfo = await functions.fetchData.discordByIdUser(
            staff[i].userID
          );

          if (!staffInfo) return res.send("wrong");

          staffInfo.avatar = functions.check.avatar(staffInfo);
          staffInfo["type"] = staff[i].type;
          staffInfo["allowed"] = staff[i].allowed;

          await newStaff.push(staffInfo);
        } else continue;
      }

      newStaff = sort(newStaff).desc((x: any) => Filter[x.type] || 0);

      return res.send(newStaff);
    } else {
      const findUser = await Website.findOne({ userID: id });
      if (!findUser || findUser.type == "member") return res.send("no");

      const UserInfo = await functions.fetchData.discordByIdUser(
        findUser?.userID
      );

      if (!UserInfo) return res.send("wrong");

      UserInfo.avatar = functions.check.avatar(UserInfo);
      UserInfo["type"] = findUser.type;
      UserInfo["allowed"] = findUser.allowed;

      res.send(UserInfo);
    }
  }
);

router.put(
  "/staff",
  async (req: Request, res: Response, next: NextFunction) => {
    let user_info: types.users_discord_info_obj = res.locals.user_info;
    let bot_info: types.users_discord_info_obj = res.locals.bot_info;
    if (user_info.type != "Developer" && user_info.type != "Head-Card-Creator")
      return next(new createHttpError.Forbidden());
    if (req.body) {
      let { user, type, allowed } = req.body;

      const findUser = await Website.findOne({ userID: user });
      const UserInfo = await functions.fetchData.discordByIdUser(user);

      if (!UserInfo) return res.send("wrong");

      if (!findUser) {
        functions.create
          .website(user, type, allowed, "", "", 0, "", "")
          .then(async (user) => {
            const staffData = await functions.fetchData.discordByIdUser(
              user.userID
            );
            if (!staffData) return res.send("wrong");

            staffData.avatar = functions.check.avatar(staffData);
            staffData["type"] = type;
            staffData["allowed"] = allowed;

            res.send(staffData);
          });
      }

      if (findUser) {
        findUser.type = type;
        findUser.allowed = allowed;
        await findUser.save();

        UserInfo.avatar = functions.check.avatar(UserInfo);
        UserInfo["type"] = findUser.type;
        UserInfo["allowed"] = findUser.allowed;

        return res.send(UserInfo);
      }
    }
  }
);

router.delete(
  "/staff",
  async (req: Request, res: Response, next: NextFunction) => {
    let user_info: types.users_discord_info_obj = res.locals.user_info;
    let bot_info: types.users_discord_info_obj = res.locals.bot_info;
    if (user_info.type != "Developer" && user_info.type != "Head-Card-Creator")
      return next(new createHttpError.Forbidden());
    if (req.body) {
      let { user } = req.body;

      const findUser = await Website.findOne({ userID: user });
      if (!findUser) return res.send("error");

      findUser.type = "member";
      findUser.allowed = false;
      findUser.save();

      res.send("ok");
    }
  }
);

export default router;
