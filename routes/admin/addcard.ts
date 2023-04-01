import * as functions from "@functions";
import * as types from "@types";
import { NextFunction, Request, Response, Router } from "express";
import * as fs from "fs";
import createHttpError from "http-errors";
import multer from "multer";
import path from "path";
import { Embed, Webhook } from "simple-discord-wh";

const router = Router();
let folder_name: string = "";

router.get(
  "/api/staff/cards/add",
  async (req: Request, res: Response, next: NextFunction) => {
    let user_info: types.users_discord_info_obj = res.locals.user_info;
    let bot_info: types.users_discord_info_obj = res.locals.bot_info;
    if (!user_info.allowed) return next(new createHttpError.Forbidden());

    res.status(200).render("AddCard", { user_info, bot_info });
  }
);

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req: Request, file: types.multer_file, cb: any) {
      cb(null, "Cards/Original");
    },
    filename: function (req: Request, file: types.multer_file, cb: any) {
      folder_name = `${Date.now()}${Math.floor(Math.random() * 1001)}.png`;

      if (fs.existsSync(`./Cards/Original/${folder_name}`))
        cb(new Error(`There is already a Card called ${folder_name}`));

      cb(null, folder_name);
    },
  }),
  fileFilter: function (req, file, callback) {
    const checkname = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (!checkname) {
      return callback(new Error("Only images are allowed"));
    }

    callback(null, true);
  },
}).single("image");

router.post(
  "/api/staff/cards/add",
  async (req: Request, res: Response, next: NextFunction) => {
    let user_info = res.locals.user_info;
    let bot_info = res.locals.bot_info;
    if (!user_info.allowed) return next(new createHttpError.Forbidden());

    upload(req, res, async (err) => {
      const { name, act, subAct, rarity, old } = req.body;

      if (err) {
        console.error(err);
        return next(new createHttpError.BadRequest());
      }

      let code = Math.random().toString(36).substring(2, 7);

      await functions.create.issues(
        name,
        act,
        subAct,
        parseInt(rarity),
        old,
        folder_name,
        code
      );

      const webhook = new Webhook(process.env.webhook_card_log!);

      const embed = new Embed()
        .setTitle("Card Added")
        .setDescription(
          `**Name:** ${name}\n**Act:** ${act}${
            subAct != "" ? `\n**Sub-Act:** ${subAct}` : ""
          }\n**Rarity:** ${functions.getRarity(
            parseInt(rarity)
          )}\n**Summon:** ${
            old == "true" ? "No" : "Yes"
          }\n**Code:** \`${code}\`\n**Added by:** <@${user_info.id}>`
        )
        .setThumbnail(`http://lapisbot.xyz/api/cards/get/${folder_name}`)
        .setFooter(
          `${bot_info.username}#${bot_info.discriminator}`,
          bot_info.avatar
        )
        .setTimestamp()
        .setColor(types.colors.green);

      await webhook.send(embed);

      return res.send({ status: 200, message: "Added Successfully" });
    });
  }
);

export default router;
