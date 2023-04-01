declare global {
  namespace NodeJS {
    interface ProcessEnv {
      developer_mode: "true" | "false";
      developer: Array<string>;
      port: string;
      mongoose: string;
      webhook_card_log: string;
      bot_token: string;
      jwt_token: string;
      client_id: string;
      client_secret: string;
      redirect_uri_lapis: string;
      oauth2Link_lapis: string;
    }
  }
}

export {};
