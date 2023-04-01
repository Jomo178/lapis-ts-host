import * as functions from "@functions";
import { Cards, Issues } from "@models";
import * as types from "@types";
import { NextFunction, Request, Response, Router } from "express";
import * as fs from "fs";
import createHttpError from "http-errors";
import multer from "multer";
import path from "path";
import { Embed, Webhook } from "simple-discord-wh";

const router = Router();

router.get(
  "/api/staff/cards/edit",
  async (req: Request, res: Response, next: NextFunction) => {
    let user_info = res.locals.user_info;
    let bot_info = res.locals.bot_info;
    if (!user_info.allowed) return next(new createHttpError.Forbidden());

    res.status(200).render("EditCard", {
      user_info,
      bot_info,
    });
  }
);

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req: Request, file: types.multer_file, cb: any) {
      cb(null, "Cards");
    },
    filename: async function (req: Request, file: types.multer_file, cb: any) {
      const findCard = await Issues.findOne({ code: req.body.code });
      if (!findCard)
        return cb(new Error(`I can't find the card in the database.`));

      const ImagePath = `./Cards/Original/${findCard.image}`;

      console.log(findCard);

      if (fs.existsSync(ImagePath)) {
        fs.unlinkSync(ImagePath);

        cb(null, findCard.image);
      } else {
        cb(new Error(`I can't find the card in the folder.`));
      }
    },
  }),
  fileFilter: function (req, file, callback) {
    const checkname = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (!checkname) {
      return callback(new Error("Only images are allowed."));
    }

    callback(null, true);
  },
}).single("image");

router.post(
  "/api/staff/cards/edit",
  async (req: Request, res: Response, next: NextFunction) => {
    let user_info = res.locals.user_info;
    const bot_info = res.locals.bot_info;
    if (!user_info.allowed) return next(new createHttpError.Forbidden());

    upload(req, res, async (err) => {
      let { code, name, act, subAct, rarity, old } = req.body;

      if (err) {
        console.error(err);
        return next(new createHttpError.BadRequest());
      }
      if (!code) return next(new createHttpError.NotAcceptable());

      const find_card = await Issues.findOne({
        code,
      });

      if (!find_card) return next(new createHttpError.NotFound());

      const webhook = new Webhook(process.env.webhook_card_log!);

      if (old == "true") old = true;
      else old = false;

      if (
        !req.file &&
        find_card.name == name &&
        find_card.act == act &&
        find_card.subAct == subAct &&
        find_card.old == old &&
        find_card.rarity == rarity
      ) {
        return res.send({
          status: 200,
          message:
            "How do you want change something? Without changing something?",
        });
      }

      res.send({
        status: 200,
        message: "Edited Successfully",
      });

      let imgText = "";
      if (req.file) imgText = "☟The Card Image has been changed!☟";

      const embed = new Embed()
        .setColor(types.colors.yellow)
        .setTitle("Card Edited")
        .setDescription(`Edited by <@${user_info.id}>`)
        .addField(
          "Before:",
          `**Name:** ${find_card.name}\n**Act:** ${find_card.act}${
            find_card.subAct != "" ? `\n**Sub-Act:** ${find_card.subAct}` : ""
          }\n**Rarity:** ${functions.getRarity(
            Number(find_card.rarity)
          )}\n**Summon:** ${
            find_card.old == true ? "No" : "Yes"
          }\n**Code:** \`${code}\``,
          true
        )
        .addField(
          "After:",
          `**Name:** ${
            name != find_card.name ? `\`${name}\`` : name
          }\n**Act:** ${act != find_card.act ? `\`${act}\`` : act}${
            subAct != find_card.subAct && subAct != ""
              ? `\n**Sub-Act:** \`${subAct}\``
              : ""
          }\n**Rarity:** ${functions.getRarity(Number(rarity))}\n**Summon:** ${
            old != find_card?.old
              ? old != true
                ? "`Yes`"
                : "`No`"
              : find_card?.old != true
              ? "Yes"
              : "No"
          }\n**Code:** \`${code}\``,
          true
        )
        .setFooter(
          `${bot_info.username}#${bot_info.discriminator}`,
          bot_info.avatar
        )
        .setThumbnail(find_card.image)
        .setTimestamp();

      await webhook.send(embed);
      // if (req.file) await webhook.sendFile(`./Cards${req.file.filename}`);

      find_card.name = name;
      find_card.act = act;
      find_card.rarity = rarity;
      find_card.subAct = subAct;
      find_card.old = old;
      await find_card.save();

      await Cards.updateMany(
        { code },
        {
          $set: {
            name,
            act,
            rarity,
            subAct,
            old,
          },
        }
      );
    });
  }
);

router.delete(
  "/api/staff/cards/edit",
  async (req: Request, res: Response, next: NextFunction) => {
    let user_info = res.locals.user_info;
    let bot_info = res.locals.bot_info;
    if (!user_info.allowed) return next(new createHttpError.Forbidden());

    const { password, code } = req.body;

    if (!password && !code)
      return res.send({
        status: 406,
        message: "Not Acceptable",
      });

    const find_card = await Issues.findOne({
      code,
    });

    if (!find_card || password != "l23021932913p")
      return res.send({
        status: 400,
        message: "Bad Request",
      });

    const webhook = new Webhook(process.env.webhook_card_log!);

    const embed = new Embed()
      .setColor(types.colors.red)
      .setTitle("Card Deleted")
      .setDescription(
        `**Name:** ${find_card.name}\n**Act:** ${find_card.act}${
          find_card.subAct != "" ? `\n**Sub-Act:** ${find_card.subAct}` : ""
        }\n**Rarity:** ${functions.getRarity(
          Number(find_card.rarity)
        )}\n**Code:** \`${find_card.code}\`\n**Deleted by:** <@${user_info.id}>`
      )
      .setFooter(
        `${bot_info.username}#${bot_info.discriminator}`,
        bot_info.avatar
      )
      .setTimestamp();
    await webhook.send(embed);

    const getFolderName = find_card.image.slice(
      find_card.image.lastIndexOf("/"),
      find_card.image.length
    );

    const ImagePath = `./Cards/${getFolderName}`;

    if (fs.existsSync(ImagePath)) fs.unlinkSync(ImagePath);

    await Issues.findOneAndDelete({ code });
    await Cards.deleteMany({ code });

    res.send({
      status: 200,
      message: "Deleted Successfully",
    });
  }
);

export default router;
