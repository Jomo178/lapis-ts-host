import { Cards, Client, Issues, Users, Website } from "@models";
import * as types from "@types";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import moment from "moment";
import { Embed, Webhook } from "simple-discord-wh";

export async function is_verified(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token } = req.cookies;
  let bot_info = await fetch_bots_data();
  bot_info.avatar = check.avatar(bot_info);
  res.locals.bot_info = bot_info;

  if (token) {
    if (token == "lapis-try-to-fetch") return next();
    try {
      const token_get_verify: any = jwt.verify(token, process.env.jwt_token!);
      if (token_get_verify) {
        const user_token = token_get_verify.token;

        const findUser = await Website.findOne({ token: user_token });
        if (!findUser) return res.render("./custom/cjdxnsjdnjdy", { bot_info });

        let user_info = await fetchData.discordByAccessToken(
          findUser.access_token
        );
        user_info.avatar = check.avatar(user_info);
        user_info = await check.CcSee(user_info);

        res.locals.user_info = user_info;

        next();
      }
    } catch (error) {
      res.clearCookie("token");
      res.redirect(process.env.oauth2Link_lapis!);
      res.end();
    }
  } else {
    return res.render("./custom/cjdxnsjdnjdy", { bot_info });
  }
}

export async function check_staff(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tokenCookie = req.cookies.token;
  if (!tokenCookie) return next(new createHttpError.Unauthorized());
  if (tokenCookie == "lapis-try-to-fetch") return next();

  try {
    let bot_info = await fetch_bots_data();
    bot_info.avatar = check.avatar(bot_info);
    res.locals.bot_info = bot_info;

    const tokenDatabase = (
      jwt.verify(tokenCookie, process.env.jwt_token!) as { token: string }
    ).token;

    const findUser = await Website.findOne({ token: tokenDatabase });

    let user_info = await fetchData.discordByAccessToken(
      findUser?.access_token!
    );
    user_info.avatar = check.avatar(user_info);
    user_info = await check.CcSee(user_info);

    res.locals.user_info = user_info;

    next();
  } catch (err) {
    console.log(err);
    res.clearCookie("token");
    next(new createHttpError.BadRequest());
  }
}

export async function fetch_bots_data() {
  const response = await axios.get<types.users_discord_info_obj>(
    `${types.discord_api_version_url}/users/@me`,
    {
      headers: {
        authorization: `Bot ${process.env.bot_token!}`,
      },
    }
  );

  return response.data;
}

export function encode(object: object): string {
  let string: string = "";

  for (const [key, value] of Object.entries(object)) {
    if (!value) continue;
    string += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }

  return string.substring(1);
}

export function getRarity(stars: number): string {
  let text = "";
  const fullStar = "<:fullstar:986333458097909881>";
  const outlineStar = "<:outlinestar:986333456961253436>";

  for (let i = 0; i < 5; i++) {
    if (i + 1 <= stars) text += fullStar;
    else text += outlineStar;
  }

  return text;
}

export function percentage(partialValue: number, totalValue: number): number {
  return (100 * partialValue) / totalValue;
}

// export async function sendMessage(
//   channelId: string,
//   content?: string,
//   embed?: types.embed
// ) {
//   if (!channelId) return console.error("Channel ID is needed!");
//   // multipart/form-data

//   const message = await axios.post(
//     `${types.discord_api_version_url}/channels/${channelId}/messages`,
//     {
//       tts: false,
//       content,
//       embed,
//     },
//     {
//       headers: {
//         authorization: `Bot ${process.env.bot_token}`,
//       },
//     }
//   );
// }

export class fetchData {
  static async discordByIdUser(id: string) {
    try {
      const response = await axios.get<types.users_discord_info_obj>(
        `${types.discord_api_version_url}/users/${id}`,
        {
          headers: {
            authorization: `Bot ${process.env.bot_token!}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return false;
    }
  }

  static async discordByAccessToken(access_token: string) {
    const response = await axios.get<types.users_discord_info_obj>(
      `${types.discord_api_version_url}/users/@me`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return response.data;
  }

  static async discordByIdEmoji(id: string) {
    const response = await axios.get<types.users_discord_info_obj>(
      `${types.discord_api_version_url}/guilds/967412014651670568/emojis/${id}`,
      {
        headers: {
          authorization: `Bot ${process.env.bot_token!}`,
        },
      }
    );

    return response.data;
  }
}

export class create {
  static async website(
    userID: string,
    type: string,
    allowed: boolean,
    access_token: string,
    refresh_token: string,
    expires_in: number,
    email: string,
    token: string
  ) {
    return await Website.create({
      userID,
      type,
      allowed,
      access_token,
      refresh_token,
      expires_in,
      email,
      token,
    });
  }

  static async issues(
    name: string,
    act: string,
    subAct: string,
    rarity: number,
    old: boolean,
    image: string,
    code: string
  ) {
    return await Issues.create({
      name,
      act,
      subAct,
      rarity,
      old,
      image,
      createdAt: new Date(),
      code,
    });
  }
}

export class check {
  static avatar(user: types.users_discord_info_obj): string {
    if (user.avatar == null || user.avatar == undefined) {
      return `https://cdn.discordapp.com/embed/avatars/${
        Number(user.discriminator) % 5
      }.png`;
    } else {
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${
        user.avatar.startsWith("a_") ? "gif" : "png"
      }`;
    }
  }

  static async CcSee(user: types.users_discord_info_obj) {
    const response = await axios.post(
      `${process.env.redirect_uri_lapis!.replace("/verify", "")}/staff`,
      {
        id: user.id,
      },
      {
        headers: {
          Cookie: "token=lapis-try-to-fetch",
        },
      }
    );

    return response.data;
  }

  static async events() {
    Client.find({}, (err: any, data: Array<any>) => {
      if (err) console.log(err);
      data.map(async (client: any) => {
        for (let i = 0; i < client.events.length; i++) {
          let event = client.events[i];

          if (!event.finished && moment().isAfter(event.end)) {
            let users = await Users.find({});
            let count = 0;

            for (let i = 0; i < users.length; i++) {
              if (users[i].badges.includes(event.emoji)) continue;
              var cards = await Cards.find({
                owner: users[i].userID,
                act: event.name,
              });
              cards = [
                ...new Map(
                  cards.map((v) => [JSON.stringify([v.act, v.name, v.code]), v])
                ).values(),
              ];

              let allIssues = await Issues.find({ act: event.name });
              let percent = percentage(cards.length, allIssues.length);

              if (percent >= event.required) {
                users[i].badges.push(event.name);
                users[i].save();
                count++;
              }
            }

            const webhook = new Webhook(process.env.webhook_card_log!);
            const embed = new Embed()
              .setDescription(
                `The badges for the **${event.name}** event were successfully issued!\n${count} people received the badges!`
              )
              .setColor(types.colors.green);

            await client.events.pull(event);
            event["finished"] = true;
            client.events.push(event);
            await client.save();
            await webhook.send(embed);
          }
        }
      });
    });
  }
}

export class EncodeDecode {
  static encode_string(string: string) {
    return btoa(
      encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(("0x" + p1) as any);
      })
    );
  }

  static decode_string(string: string) {
    return decodeURIComponent(
      atob(string)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }
}
