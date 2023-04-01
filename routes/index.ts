import { check_staff } from "@functions";
import express from "express";
import createHttpError from "http-errors";
import add_card_router from "./admin/addcard";
import card_creator_router from "./admin/cardcreator";
import edit_card_router from "./admin/editcard";
import events_router from "./admin/events";
import staff_router from "./admin/staff";
// import stats_router from "./admin/stats";
import cards_router from "./api/cards";
import give_card_router from "./api/givecard";
import verify_router from "./authentication/verify";

const router = express.Router();

router.use("/", cards_router);

router.use("/", verify_router);

router.use(check_staff);
router.use("/", card_creator_router);
router.use("/", add_card_router);
router.use("/", edit_card_router);
router.use("/", give_card_router);
router.use("/", events_router);
router.use("/", staff_router);
// router.use("/", stats_router);

router.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(new createHttpError.NotFound());
  }
);

export default router;
