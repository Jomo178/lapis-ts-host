import axios from "axios";
import cookie_parser from "cookie-parser";
import { config } from "dotenv";
import express, { response } from "express";
import mongoose from "mongoose";
import routers from "./routes";
config();

if (process.env.developer_mode === "true") {
  // process.env.bot_token =
  //   "OTk1Mjk1Mjk3MTc1NTY4NDc3.GUhEtg.K5rmgm2rpKtVD836ng1mLNjAFWnl4TUAYw7GFM";
  process.env.redirect_uri_lapis = "http://localhost:3000";
  process.env.port = "3000";
  process.env.webhook_card_log =
    "https://discord.com/api/webhooks/986017412971364452/jDaJJz76mhtY5pWW9WOnjxpPs-pGrcwz1BIdvFsyGgsSuoki3zAt5wu7PS_QcFtPuHNJ";
  process.env.mongoose =
    "mongodb+srv://Lapis_web:nero@jomo.kosg3.mongodb.net/lapis?retryWrites=true&w=majority";
  process.env.redirect_uri_lapis = "http://localhost:3000/verify";
  process.env.oauth2Link_lapis =
    "https://discord.com/api/oauth2/authorize?client_id=967491214066737222&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fverify&response_type=code&scope=identify%20guilds%20email";
}

mongoose
  .connect(process.env.mongoose!, { dbName: "lapis" })
  .then(() => console.log("Mongo is connected!"));

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(cookie_parser());

app.use(routers);

app.use(function (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(process.env.port, () =>
  console.log(process.env.redirect_uri_lapis!.replace("/verify", ""))
);
