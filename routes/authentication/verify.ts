import * as functions from "@functions";
import { Website } from "@models";
import * as types from "@types";
import axios from "axios";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/verify", async (req: Request, res: Response) => {
  const code = req.query.code;
  if (code) {
    let response = await axios.post<types.access_token_response>(
      `${types.discord_api_version_url}/oauth2/token`,
      functions.encode({
        client_id: process.env.client_id!,
        client_secret: process.env.client_secret!,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.redirect_uri_lapis!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let { access_token, refresh_token, expires_in } = response.data;

    let token = Math.random().toString().substring(2);

    const jwt_access_token = jwt.sign(
      {
        token,
      },
      process.env.jwt_token!
    );

    const getUsersData = await functions.fetchData.discordByAccessToken(
      access_token
    );

    let findUser = await Website.findOne({ userID: getUsersData.id });
    if (!findUser) {
      findUser = await functions.create.website(
        getUsersData.id,
        "member",
        false,
        access_token,
        refresh_token,
        expires_in,
        getUsersData.email,
        token
      );
      res.cookie("token", jwt_access_token, { maxAge: 60000 * 60 * 24 * 7 });

      return res.redirect("/cardcreator");
    }

    findUser.token = token;
    findUser.access_token = access_token;
    findUser.refresh_token = refresh_token;
    findUser.email = getUsersData.email;
    findUser.expires_in = expires_in;
    await findUser.save();

    res.cookie("token", jwt_access_token, { maxAge: 60000 * 60 * 24 * 7 });

    res.redirect("/staff/menu");
  } else {
    if (!req.cookies.token) {
      res.redirect(process.env.oauth2Link_lapis!);
    }
  }
});

router.get("/login", (req: Request, res: Response) => {
  res.redirect(process.env.oauth2Link_lapis!);
});

export default router;
