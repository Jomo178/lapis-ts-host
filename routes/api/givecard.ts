import * as functions from "@functions";
import { Client, Issues } from "@models";
import * as types from "@types";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import moment from "moment";

const router = Router();

router.get(
  "/api/staff/cards/give/:type",
  async (req: Request, res: Response, next: NextFunction) => {
    let bot_info: types.users_discord_info_obj = res.locals.bot_info;

    switch (req.params.type) {
      case "events":
        // const findBot = await Client.findOne({ userID: bot_info.id });
        // if (!findBot) return next(new createHttpError.NotFound());

        return res.status(200).send({
          status: 200,
          message: "Successfully",
          data: [],
          // data: findBot.events,
        });

      case "cards":
        const cards = (await Issues.find({}).limit(50)).reverse();

        for (let i = 0; i < cards.length; i++) {
          cards[i].createdAt = moment(new Date(cards[i].createdAt))
            .format("lll")
            .toString();
        }

        return res.status(200).send({
          status: 200,
          message: "Successfully",
          data: cards,
        });

      case "search":
        let { name, act, subAct, code, rarity }: any = req.query;

        let searchTerm: any = {};

        if (name) searchTerm["name"] = { $regex: name, $options: "i" };
        if (act) searchTerm["act"] = { $regex: act, $options: "i" };
        if (subAct) searchTerm["subAct"] = { $regex: subAct, $options: "i" };
        if (!isNaN(parseInt(rarity))) searchTerm["rarity"] = parseInt(rarity);
        if (code) searchTerm = { code };

        if (Object.keys(searchTerm).length == 0)
          return next(new createHttpError.NotAcceptable());

        let searchedCards = await Issues.find(searchTerm).collation({
          locale: "en",
          strength: 1,
        });

        for (let i = 0; i < searchedCards.length; i++) {
          searchedCards[i].createdAt = moment(
            new Date(searchedCards[i].createdAt)
          )
            .format("lll")
            .toString();
        }

        return res.status(200).send({
          status: 200,
          message: "Successfully",
          data: searchedCards,
        });

      default:
        return next(new createHttpError.NotAcceptable());
    }
  }
);

export default router;
